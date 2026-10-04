import pandas as pd
from typing import List, Tuple, Dict, Any, Union, Optional
from datetime import datetime
from ..models.schemas import FlowTelemetry

COLUMN_MAPPINGS = {
    "timestamp": ["timestamp", "time", "date_time", "Time", "Timestamp", "frame.time_epoch"],
    "src_ip": ["src_ip", "source_ip", "src", "Source IP", "src_host", "ip.src"],
    "dst_ip": ["dst_ip", "destination_ip", "dst", "Destination IP", "dst_host", "ip.dst"],
    "src_port": ["src_port", "source_port", "sport", "Source Port", "tcp.srcport", "udp.srcport"],
    "dst_port": ["dst_port", "destination_port", "dport", "Destination Port", "tcp.dstport", "udp.dstport"],
    "protocol": ["protocol", "proto", "Protocol"],
    "packets": ["packets", "packet_count", "tot_pkts", "Total Packets", "pkts"],
    "bytes": ["bytes", "byte_count", "tot_bytes", "Total Bytes", "size"],
    "duration": ["duration", "flow_duration", "Duration", "dur"],
    "tcp_flags": ["tcp_flags", "flags", "TCP Flags", "tcp.flags"],
    "label": ["label", "attack_category", "class", "Label", "tag"]
}

class TelemetryIngestionService:
    @staticmethod
    def _find_column(df_columns: List[str], target: str) -> Optional[str]:
        candidates = COLUMN_MAPPINGS.get(target, [target])
        for col in df_columns:
            if col.strip() in candidates or col.strip().lower() in [c.lower() for c in candidates]:
                return col
        return None

    @classmethod
    def load_from_csv(cls, filepath: str) -> Tuple[List[FlowTelemetry], List[str], List[Dict[str, Any]]]:
        df = pd.read_csv(filepath)
        return cls.normalize_dataframe(df)

    @classmethod
    def load_from_parquet(cls, filepath: str) -> Tuple[List[FlowTelemetry], List[str], List[Dict[str, Any]]]:
        df = pd.read_parquet(filepath)
        return cls.normalize_dataframe(df)

    @classmethod
    def normalize_dataframe(cls, df: pd.DataFrame) -> Tuple[List[FlowTelemetry], List[str], List[Dict[str, Any]]]:
        raw_columns = list(df.columns)
        normalized_records: List[FlowTelemetry] = []
        invalid_rows: List[Dict[str, Any]] = []

        time_col = cls._find_column(raw_columns, "timestamp")
        src_ip_col = cls._find_column(raw_columns, "src_ip")
        dst_ip_col = cls._find_column(raw_columns, "dst_ip")
        src_port_col = cls._find_column(raw_columns, "src_port")
        dst_port_col = cls._find_column(raw_columns, "dst_port")
        proto_col = cls._find_column(raw_columns, "protocol")
        pkts_col = cls._find_column(raw_columns, "packets")
        bytes_col = cls._find_column(raw_columns, "bytes")
        dur_col = cls._find_column(raw_columns, "duration")
        flags_col = cls._find_column(raw_columns, "tcp_flags")
        label_col = cls._find_column(raw_columns, "label")

        for idx, row in df.iterrows():
            try:
                # Check mandatory fields
                if not time_col or pd.isna(row[time_col]):
                    invalid_rows.append({"row_index": idx, "reason": "Missing timestamp"})
                    continue
                if not src_ip_col or pd.isna(row[src_ip_col]) or not dst_ip_col or pd.isna(row[dst_ip_col]):
                    invalid_rows.append({"row_index": idx, "reason": "Missing source or destination IP"})
                    continue

                ts_raw = row[time_col]
                if isinstance(ts_raw, (int, float)):
                    ts = datetime.fromtimestamp(ts_raw)
                else:
                    ts = pd.to_datetime(ts_raw).to_pydatetime()

                src_port = int(row[src_port_col]) if src_port_col and not pd.isna(row[src_port_col]) else None
                dst_port = int(row[dst_port_col]) if dst_port_col and not pd.isna(row[dst_port_col]) else None
                proto = str(row[proto_col]) if proto_col and not pd.isna(row[proto_col]) else "TCP"
                packets = int(row[pkts_col]) if pkts_col and not pd.isna(row[pkts_col]) else 1
                bytes_cnt = int(row[bytes_col]) if bytes_col and not pd.isna(row[bytes_col]) else 0
                duration = float(row[dur_col]) if dur_col and not pd.isna(row[dur_col]) else 0.0
                flags = str(row[flags_col]) if flags_col and not pd.isna(row[flags_col]) else None
                lbl = str(row[label_col]) if label_col and not pd.isna(row[label_col]) else None

                record = FlowTelemetry(
                    timestamp=ts,
                    src_ip=str(row[src_ip_col]).strip(),
                    dst_ip=str(row[dst_ip_col]).strip(),
                    src_port=src_port,
                    dst_port=dst_port,
                    protocol=proto.upper(),
                    packets=packets,
                    bytes=bytes_cnt,
                    duration=duration,
                    tcp_flags=flags,
                    label=lbl
                )
                normalized_records.append(record)

            except Exception as e:
                invalid_rows.append({"row_index": idx, "reason": str(e)})

        # Ensure chronological ordering
        normalized_records.sort(key=lambda x: x.timestamp)
        return normalized_records, raw_columns, invalid_rows
