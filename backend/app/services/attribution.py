import torch
import numpy as np
from typing import List, Dict, Any, Optional
from .dataset_builder import FEATURE_NAMES

class IntegratedGradientsAttribution:
    """
    Computes Integrated Gradients feature attribution for TemporalWorldModel outputs.
    Formula: IG_i(x) = (x_i - x_i') * integral_0^1 (dF(x' + alpha*(x - x')) / dx_i) d_alpha
    Baseline x' = zeros vector.
    """
    @staticmethod
    def attribute(
        model: torch.nn.Module,
        input_tensor: torch.Tensor,
        target_class: int = 3,  # Lateral Movement default
        steps: int = 20
    ) -> Dict[str, float]:
        """
        input_tensor: shape (1, L, D) where L=context_length, D=12
        Returns feature attribution scores per feature name.
        """
        model.eval()
        baseline = torch.zeros_like(input_tensor)
        scaled_inputs = [baseline + (float(i) / steps) * (input_tensor - baseline) for i in range(steps + 1)]

        grads = []
        for scaled_input in scaled_inputs:
            scaled_input = scaled_input.clone().detach().requires_grad_(True)
            _, pred_logits = model(scaled_input)
            
            # Target future horizon step 0, target class
            score = pred_logits[0, 0, target_class]
            model.zero_grad()
            score.backward()
            
            grads.append(scaled_input.grad.detach().cpu().numpy())

        # Average gradients across interpolation steps
        avg_grads = np.mean(np.array(grads), axis=0)  # (1, L, D)
        delta = (input_tensor - baseline).detach().cpu().numpy()  # (1, L, D)

        ig_vector = avg_grads * delta  # (1, L, D)
        # Sum attribution across history context steps for each feature D
        feature_attributions = np.sum(ig_vector[0], axis=0)  # (D,)

        # Normalize absolute attributions into percentages
        abs_sum = np.sum(np.abs(feature_attributions)) + 1e-6
        norm_scores = (np.abs(feature_attributions) / abs_sum) * 100.0

        attribution_map: Dict[str, float] = {}
        for idx, feat_name in enumerate(FEATURE_NAMES):
            attribution_map[feat_name] = round(float(norm_scores[idx]), 2)

        return attribution_map
