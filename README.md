# Cancelable Biometric Template Benchmark

A Google Colab research prototype that compares three cancelable biometric transformations on features derived from eye images: Index-of-Max (IoM) hashing, BioHashing, and random projection.

> **Scope note:** Despite the repository's current name, this notebook does **not** implement a diffusion model. The current implementation uses an ImageNet-pretrained EfficientNetB0 backbone followed by classical machine-learning classifiers.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/prince9939367489/Diffusion-Model-Based-Cancelable-Biometric-Templates/blob/main/Project.ipynb)

**Live results showcase:** [Explore the recorded benchmark output](https://prince-biometric-research.princekumar120207.chatgpt.site)

## Overview

The notebook performs a four-class image-classification experiment:

1. Loads eye images from class-based folders.
2. Resizes images to 224 × 224 pixels and applies EfficientNet preprocessing.
3. Uses an ImageNet-pretrained EfficientNetB0 backbone, global average pooling, and an untrained 512-unit projection layer to produce feature vectors.
4. Transforms those vectors using IoM hashing, BioHashing, and 128-dimensional random projection.
5. Tunes Random Forest, RBF SVM, KNN, and XGBoost classifiers with three-fold cross-validation.
6. Reports test accuracy, weighted precision, weighted recall, and weighted F1.

```text
class folders
    → OpenCV image loading and resizing
    → EfficientNetB0 feature pipeline
    → cancelable template transformation
    → tuned classifier
    → classification metrics
```

## Notebook and Recorded Output

- [View the rendered notebook and its saved output](https://github.com/prince9939367489/Diffusion-Model-Based-Cancelable-Biometric-Templates/blob/main/Project.ipynb)
- [Open and rerun the notebook in Google Colab](https://colab.research.google.com/github/prince9939367489/Diffusion-Model-Based-Cancelable-Biometric-Templates/blob/main/Project.ipynb)

The committed notebook retains output from an earlier 80/20 stratified run on **14,161 images across four folder-defined classes**. The dataset is not included, so these values have not been independently reproduced. They should be treated as recorded experimental output rather than a general performance claim.

### Recorded Test Accuracy

| Transformation | Random Forest | SVM | KNN | XGBoost |
|---|---:|---:|---:|---:|
| IoM hashing | 75.11% | 63.93% | 61.63% | 70.21% |
| BioHashing | 94.60% | **95.27%** | 93.47% | 93.15% |
| Random projection | 94.32% | 94.92% | 93.93% | 93.58% |

The highest saved result is **BioHashing with an RBF SVM: 95.27% accuracy and 95.26% weighted F1**.

## Technology Stack

- Python and Google Colab
- TensorFlow / Keras and EfficientNetB0
- OpenCV and NumPy
- scikit-learn
- XGBoost

## Run the Experiment

The notebook expects one subdirectory per class:

```text
Eye dataset/
├── class-1/
│   ├── image-001.jpg
│   └── ...
├── class-2/
├── class-3/
└── class-4/
```

1. Open [Project.ipynb](./Project.ipynb) in Colab.
2. Place an appropriately licensed dataset in Google Drive. The default location is `/content/drive/MyDrive/Eye dataset`.
3. To use another location, edit `DATASET_PATH_OVERRIDE` in the notebook's configuration cell:

   ```python
   DATASET_PATH_OVERRIDE = "/path/to/Eye dataset"
   ```

   Alternatively, set `EYE_DATASET_PATH` before running the experiment cell:

   ```python
   import os
   os.environ["EYE_DATASET_PATH"] = "/path/to/Eye dataset"
   ```

4. Run the notebook cells in order. The notebook validates the path and sorts class folders and image filenames for stable label assignment.

The dependency-install cell does not pin versions. For the closest comparison with the saved run, its output records TensorFlow 2.19.0, scikit-learn 1.6.1, OpenCV 4.13.0.92, XGBoost 3.2.0, and NumPy 2.0.2.

## Reproducibility Controls

The current notebook centralizes a seed value and applies it to NumPy, TensorFlow, the train/test split, Random Forest, XGBoost, randomized search, and the projection matrices. It also requests deterministic TensorFlow operations where supported and loads folders/files in sorted order.

These controls reduce accidental variation; they do not make the saved results independently reproducible without the original dataset and environment. The recorded outputs predate this cleanup and were deliberately preserved rather than regenerated.

## Limitations and Responsible Interpretation

- **No diffusion model is present.** Either a genuine diffusion component must be implemented and evaluated, or the repository itself should eventually be renamed to match the current benchmark.
- **The dataset is private or undocumented.** Its source, license, four class definitions, subject split, and collection protocol are not provided.
- **This is classification, not biometric verification.** FAR, FRR, EER, ROC curves, subject-disjoint evaluation, unlinkability, irreversibility, and revocability are not measured.
- **The transform seed is public and fixed.** It exists for repeatability and is not a secret, user-specific key or evidence that the generated templates are secure.
- **The 512-unit Dense layer is not trained.** It is a seeded, randomly initialized nonlinear feature projection after the pretrained backbone; the Dropout layer is inactive during `predict`. This design is retained to stay close to the saved experiment.
- **OpenCV loads BGR images.** The current experiment does not explicitly convert them to RGB before the EfficientNet pipeline; correcting this would require rerunning and replacing the recorded results.
- **The test set is reused across many model/transform comparisons.** Reporting the best combination can introduce model-selection bias without a separate final holdout set.
- **There is no packaged model or inference application.** The notebook and static results showcase are the current demos; no live biometric inference system is claimed.
- **Package versions are not locked.** Future library changes can affect behavior and results.

## Next Steps

- Document an approved dataset source, its class meanings, and a subject-disjoint evaluation protocol.
- Replace or train the projection head and rerun the benchmark with explicit RGB conversion.
- Add confusion matrices plus biometric verification and template-security metrics.
- Pin dependencies and publish a machine-readable results file.
- Export a reproducible inference pipeline before building a Gradio or Streamlit demonstration.
- Implement and evaluate a diffusion-based method before describing this work as diffusion-based.
