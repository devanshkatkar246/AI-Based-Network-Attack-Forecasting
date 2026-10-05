import os
import sys

def verify_pdf(pdf_path):
    print(f"[PDF Verification] Inspecting file: {pdf_path}")
    if not os.path.exists(pdf_path):
        print(f"[PDF Error] File does not exist: {pdf_path}")
        return False

    size_bytes = os.path.getsize(pdf_path)
    print(f"[PDF Verification] File size: {size_bytes} bytes")

    if size_bytes < 5000:
        print(f"[PDF Error] File size is suspiciously small ({size_bytes} bytes). PDF is likely blank or corrupted.")
        return False

    try:
        import fitz  # PyMuPDF
        doc = fitz.open(pdf_path)
        print(f"[PDF Verification] Total Pages: {len(doc)}")
        
        has_text = False
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text()
            print(f"[Page {page_idx + 1}] Text Length: {len(text)} characters")
            if text.strip():
                print(f"[Page {page_idx + 1} Snippet]: {text[:100]}...")
                has_text = True
            
            # Render page to PNG for visual inspection
            pix = page.get_pixmap(dpi=150)
            img_path = pdf_path.replace(".pdf", f"_page_{page_idx+1}.png")
            pix.save(img_path)
            print(f"[Page {page_idx + 1} Image]: Rendered to {img_path}")

        return True
    except ImportError:
        print("[PDF Warning] PyMuPDF (fitz) not installed. Checking basic file structure.")
        with open(pdf_path, "rb") as f:
            header = f.read(1024)
            if b"%PDF-" in header:
                print("[PDF Verification] Valid PDF Header found (%PDF-)")
                return True
            else:
                print("[PDF Error] Invalid PDF header.")
                return False

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "test.pdf"
    verify_pdf(target)
