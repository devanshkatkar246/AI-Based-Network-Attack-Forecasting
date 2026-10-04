import pytest
import numpy as np
from backend.app.services.baselines import BaselineModelsEvaluator

def test_baselines_evaluator():
    X_tr = np.random.randn(20, 3, 12).astype(np.float32)
    Y_lbl_tr = np.random.randint(0, 5, size=(20, 2))
    X_te = np.random.randn(10, 3, 12).astype(np.float32)
    Y_lbl_te = np.random.randint(0, 5, size=(10, 2))

    res = BaselineModelsEvaluator.evaluate_all(X_tr, Y_lbl_tr, X_te, Y_lbl_te)

    assert "Logistic Regression" in res
    assert "Random Forest" in res
    assert "MLP (Feedforward)" in res
    assert "f1_score" in res["Random Forest"]
