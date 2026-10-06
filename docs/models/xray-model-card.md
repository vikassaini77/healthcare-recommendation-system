# Model Card: Chest X-Ray Classification (DenseNet121)

## Model Details
- **Architecture:** DenseNet121 (PyTorch / TorchVision).
- **Version:** 1.0.0
- **Input:** 224x224 RGB/Grayscale image tensors, normalized to ImageNet statistics `[0.485, 0.456, 0.406]`.
- **Output:** Sigmoid probabilities for 14 independent thoracic classes (e.g., Atelectasis, Cardiomegaly, Effusion, Infiltration, Mass, Nodule, Pneumonia, Pneumothorax, Consolidation, Edema, Emphysema, Fibrosis, Pleural Thickening, Hernia).
- **Explainability:** Generates Grad-CAM spatial heatmaps derived from the final dense block.

## Intended Use
- **Primary Use Case:** Educational research for building Explainable AI (XAI) pipelines applied to radiological imaging.
- **Out of Scope:** Clinical diagnostic workflows, primary read replacement, patient screening.

## Dataset
- **Training Data:** NIH Chest X-ray Dataset (ChestX-ray14) comprising over 100,000 anonymized frontal-view X-ray images from ~30,000 patients.
- **Data Split:** Official patient-wise splits to prevent data leakage of the same patient's temporal scans across train/val sets.

## Training & Evaluation
- **Methodology:** Fine-tuning from ImageNet pre-trained weights using Binary Cross Entropy with Logits Loss.
- **Metrics:** 
  - Monitored via AUROC (Area Under the Receiver Operating Characteristic curve) per class.
  - Overall AUROC metrics range depending on specific class rarity and morphological distinctness.

## Bias & Limitations
- **Data Bias:** 
  - The dataset originates from a single clinical center, leading to potential domain shift issues (e.g., scanner noise, institutional protocols) when applied to external data.
  - Bounding box annotations and NLP-extracted labels in the original dataset carry inherent noise and errors.
- **Subpopulation Bias:** May underperform on demographic groups underrepresented in the NIH dataset.

## Failure Cases
- **Non-Frontal Views:** Will likely fail unpredictably if fed lateral X-rays or non-chest imaging.
- **Medical Devices:** Pacemakers, chest tubes, and foreign objects may falsely trigger certain class predictions (e.g., being interpreted as nodules or masses).
- **Poor Image Quality:** Low contrast or poor patient positioning significantly degrades accuracy.

## Ethical Considerations
- **Human in the Loop:** A physician must always independently review radiographic images; the AI is strictly supplementary for research settings.
- **Automation Bias:** The visual appeal of Grad-CAM heatmaps can cause users to over-trust the model even when predictions are erroneous.
