# 🎓 3-Hour Lecture: Data Preprocessing, EDA & Feature Engineering
## Complete Teaching Guide with Timing

---

## 📋 Lecture Overview

**Total Duration:** 3 hours (180 minutes)
**Target Audience:** Undergraduate/Graduate students in Data Science/Computer Science
**Prerequisites:** Basic Python, Statistics fundamentals
**Learning Outcomes:** Students will be able to clean, preprocess, analyze, and engineer features from raw datasets

### **Course Structure:**
- **Part 1:** Data Preprocessing & Cleaning (60 min)
- **Part 2:** Exploratory Data Analysis (45 min)
- **Part 3:** Feature Engineering & Selection (45 min)
- **Part 4:** Q&A & Practical Exercise (30 min)

---

## 🕐 PART 1: DATA PREPROCESSING & CLEANING (60 minutes)

### **Module 1.1: Introduction & Motivation** (10 min)

#### **Opening Hook** (2 min)
> "Garbage in, garbage out! Data scientists spend 60-80% of their time on data preprocessing. Let's learn why and how to do it right."

**Key Message:**
- Real-world data is MESSY (show examples)
- Quality of preprocessing = Quality of model
- Most crucial skill in data science

#### **Real-World Horror Stories** (3 min)
Share examples:
1. **Amazon's recruiting AI** (biased due to unclean historical data)
2. **Healthcare predictions** (missing values causing incorrect diagnoses)
3. **Financial models** (outliers causing million-dollar errors)

#### **Learning Roadmap** (5 min)
Present visual roadmap:
```
Raw Data → Clean Data → Analyzed Data → Engineered Features → Model
    ↓         ↓            ↓                ↓
  Missing   Outliers    Patterns       New Features
  Noise     Scaling     Correlations   Selection
```

---

### **Module 1.2: Missing Values** (20 min)

#### **Why Data Goes Missing** (3 min)

**Three Types:**
1. **MCAR** (Missing Completely At Random)
   - Example: Random sensor failures
   - Safe to delete or impute

2. **MAR** (Missing At Random)
   - Example: Younger people don't report income
   - Depends on other variables

3. **MNAR** (Missing Not At Random)
   - Example: High earners hide income
   - Dangerous! Needs careful handling

#### **Detection Strategies** (4 min)

**Live Demo:** Show on screen
```python
# Quick missing value check
df.isnull().sum()
df.isnull().sum() / len(df) * 100  # Percentage

# Visualize missing patterns
import missingno as msno
msno.matrix(df)
```

**Key Questions to Ask:**
- How much is missing? (< 5% = safe to delete, > 40% = problematic)
- Random or pattern?
- Related to target variable?

#### **Imputation Methods** (8 min)

**Method 1: Simple Imputation** (2 min)
- Mean: Fast but sensitive to outliers
- Median: Robust, good for skewed data
- Mode: For categorical data
- Constant: When 0 or -1 has meaning

**Interactive Exercise:**
> "Quick poll: You have income data with 10% missing and 3 billionaire outliers. Mean or median?"
> Answer: Median!

**Method 2: Advanced Imputation** (3 min)
- Forward/Backward Fill: Time series
- KNN Imputation: Uses similar records
- MICE: Multivariate iterative chaining
- Model-based: Random Forest, etc.

**Code Example on Screen:**
```python
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df_filled = imputer.fit_transform(df)
```

**Method 3: Domain-Specific** (2 min)
- Business logic (e.g., "No response" → 0 for survey)
- Indicator variables (create "is_missing" flag)

**Decision Framework** (1 min)
```
< 5% missing + Random → Delete
5-40% missing + Important feature → Impute
> 40% missing → Consider dropping feature
Patterned missing → Investigate first!
```

#### **Checkpoint Question** (2 min)
> "What happens if you impute missing values using the mean calculated from the ENTIRE dataset (training + test)?"
> **Answer:** Data leakage! Always fit on training only.

---

### **Module 1.3: Outliers** (15 min)

#### **What are Outliers?** (3 min)

**Definition:** Extreme values that deviate significantly from other observations

**Types:**
1. **Univariate:** Single variable (e.g., 200-year-old person)
2. **Multivariate:** Combination is unusual (e.g., 5-year-old with PhD)

**Visual Story:**
Show scatter plot: "See that point way out there? That's either:
- An error (typo, sensor malfunction) → Remove
- A genuine extreme (CEO salary) → Keep!
- A rare but important case (disease outbreak) → Investigate!"

#### **Detection Methods** (5 min)

**Method 1: IQR (Interquartile Range)** (2 min)
```python
Q1 = df['column'].quantile(0.25)
Q3 = df['column'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR
```

**Visual:** Show boxplot
- Box = IQR (middle 50%)
- Whiskers = 1.5 × IQR
- Dots beyond = outliers

**Method 2: Z-Score** (2 min)
```python
z_scores = np.abs(stats.zscore(df['column']))
outliers = df[z_scores > 3]
```

**Rule of thumb:**
- |Z| > 2: 95% confidence (moderate outlier)
- |Z| > 3: 99.7% confidence (extreme outlier)

**Comparison Table** (1 min)
| Method | Best For | Assumes |
|--------|----------|---------|
| IQR | Non-normal data | Nothing! |
| Z-Score | Normal data | Normal distribution |
| Isolation Forest | High-dimensional | Nothing |
| DBSCAN | Clusters | Density patterns |

#### **Handling Strategies** (5 min)

**Strategy 1: Removal** (1 min)
- When: Clear errors, plenty of data
- Risk: Losing valuable information

**Strategy 2: Capping (Winsorization)** (2 min)
```python
upper = df['price'].quantile(0.99)
df['price_capped'] = df['price'].clip(upper=upper)
```
- Limits extreme values
- Preserves all records

**Strategy 3: Transformation** (2 min)
```python
df['log_price'] = np.log1p(df['price'])
```
- Log transform: Pulls in extremes
- Square root: Milder effect
- Box-Cox: Auto-optimizes

**Visual Comparison:**
Show before/after distributions

#### **Decision Framework** (2 min)
```
1. Is it an error? → Remove
2. Is it rare but real? → Keep & maybe flag
3. Do you have many? → Keep
4. Is it distorting model? → Transform or cap
5. Unsure? → Create two versions and test both
```

---

### **Module 1.4: Noise Reduction** (8 min)

#### **Understanding Noise** (2 min)
**Definition:** Random errors that obscure true signal

**Example:** Temperature sensor
- True: Smooth curve
- Measured: Jagged with spikes
- Goal: Recover true signal

#### **Smoothing Techniques** (4 min)

**Moving Average** (2 min)
```python
window = 7
df['smoothed'] = df['value'].rolling(window).mean()
```
- Simple, fast
- Lags behind changes
- Good for: Stock prices, weather

**Moving Median** (1 min)
```python
df['smoothed'] = df['value'].rolling(window).median()
```
- Robust to outliers
- Better for: Sensor data with glitches

**Exponential Smoothing** (1 min)
```python
df['smoothed'] = df['value'].ewm(span=7).mean()
```
- Weighs recent data more
- Responsive to trends

**Visual Demo:** Plot all three on same graph

#### **When to Smooth?** (2 min)
✅ **Do smooth:**
- Time series with measurement error
- High-frequency noise obscuring pattern

❌ **Don't smooth:**
- When spikes are meaningful (earthquake detection!)
- For training data (model should learn from raw)
- Classification problems (usually)

---

### **Module 1.5: Scaling & Normalization** (7 min)

#### **The Distance Problem** (2 min)

**Demonstration:**
```python
# Two features:
age = [25, 30, 35]  # Range: 10
income = [50000, 80000, 120000]  # Range: 70,000

# Euclidean distance dominated by income!
```

**Show KNN accuracy:**
- Without scaling: 65%
- With scaling: 89%

**Visual:** Scatter plot before/after

#### **Scaling Methods** (5 min)

**Quick Reference Table:**
| Method | Formula | Range | Use For |
|--------|---------|-------|---------|
| Min-Max | (x-min)/(max-min) | [0,1] | Neural nets, images |
| Standard | (x-μ)/σ | μ=0, σ=1 | Linear models, SVM |
| Robust | (x-median)/IQR | Variable | Data with outliers |

**Live Coding:** Scale same data three ways

**Key Rules:**
1. ✅ MUST scale: KNN, SVM, Neural Nets, PCA
2. ❌ No need: Trees, Random Forest, XGBoost
3. ⚠️ Critical: Fit on train, transform on test!

```python
# RIGHT
scaler.fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)

# WRONG - data leakage!
scaler.fit_transform(pd.concat([X_train, X_test]))
```

---

## 🕑 PART 2: EXPLORATORY DATA ANALYSIS (45 minutes)

### **Module 2.1: The Art of EDA** (5 min)

#### **Philosophy** (2 min)
> "EDA is detective work. You're looking for clues about:
> - What's in your data?
> - What's wrong with your data?
> - What stories does your data tell?"

**John Tukey Quote:**
> "The greatest value of a picture is when it forces us to notice what we never expected to see."

#### **EDA Goals** (3 min)
1. **Understand:** Distribution, range, types
2. **Discover:** Patterns, relationships, anomalies
3. **Validate:** Assumptions, data quality
4. **Inspire:** Feature engineering ideas

**The EDA Mindset:**
- Be curious, not confirmatory
- Question everything
- Let data surprise you

---

### **Module 2.2: Summary Statistics** (10 min)

#### **The Five-Number Summary** (4 min)

**Core Statistics:**
```python
df.describe()
```

**What each tells you:**
1. **Count:** Missing values? (100 expected, 85 present → 15 missing)
2. **Mean:** Central tendency
3. **Std:** Spread (high std = high variability)
4. **Min/Max:** Range, spot impossible values
5. **Quartiles:** Distribution shape

#### **Advanced Statistics** (3 min)

**Skewness:**
- = 0: Symmetric (normal)
- \> 0: Right-skewed (tail to right)
- < 0: Left-skewed (tail to left)

**Kurtosis:**
- = 3: Normal distribution
- \> 3: Heavy tails (outliers!)
- < 3: Light tails

```python
df['column'].skew()
df['column'].kurtosis()
```

#### **Live Demo** (3 min)
Take real dataset (e.g., housing prices):
1. Show describe()
2. Point out: Mean >> Median → Right skew
3. Show: Max price = $5M → Outlier?
4. Calculate: std = $200k → High variability

**Quick Exercise:**
> "Mean = $500k, Median = $300k. What does this tell us?"
> **Answer:** Right-skewed, likely outliers pulling mean up!

---

### **Module 2.3: Distributions** (12 min)

#### **Why Distributions Matter** (2 min)
- Many algorithms assume normal distribution
- Violations → poor performance
- Understanding shape → better transformations

#### **Distribution Types** (4 min)

**Normal (Gaussian):**
- Bell curve, symmetric
- Mean = Median = Mode
- Example: Heights, test scores

**Skewed:**
- Right-skewed: Income (few rich people)
- Left-skewed: Age at death (most live long)

**Bimodal:**
- Two peaks
- Often means two groups mixed
- Example: Heights (men + women)

**Uniform:**
- Flat, all values equally likely
- Example: Random number generator

**Exponential:**
- Decreasing rapidly
- Example: Time between events

#### **Visualization Methods** (4 min)

**Histogram:**
```python
df['column'].hist(bins=30)
```
- Shows frequency distribution
- Choose bins wisely!

**KDE (Kernel Density Estimate):**
```python
df['column'].plot(kind='kde')
```
- Smooth version of histogram
- Good for comparing multiple distributions

**Q-Q Plot:**
```python
stats.probplot(df['column'], dist="norm", plot=plt)
```
- Tests normality
- Points on line = normal

**Box Plot:**
```python
df.boxplot(column='price', by='category')
```
- Compare distributions
- Spot outliers

#### **Live Visualization** (2 min)
Create all four plots for same variable
Point out insights from each

---

### **Module 2.4: Correlations** (10 min)

#### **Understanding Correlation** (3 min)

**Definition:** Measures linear relationship strength

**Pearson Correlation Coefficient:**
- Range: -1 to +1
- +1: Perfect positive (both increase together)
- -1: Perfect negative (one up, other down)
- 0: No linear relationship

**Important:**
⚠️ **Correlation ≠ Causation!**

**Classic Examples:**
1. Ice cream sales ↔ Drowning deaths
   - Correlated: YES (both high in summer)
   - Causal: NO (heat causes both)

2. Nicolas Cage films ↔ Pool drownings
   - Spurious correlation!

#### **Correlation Analysis** (4 min)

**Correlation Matrix:**
```python
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
```

**Interpretation Guide:**
- |r| > 0.7: Strong
- 0.4 < |r| < 0.7: Moderate
- |r| < 0.4: Weak

**What to look for:**
1. **High correlations** with target variable
   - These are your key features!

2. **High correlations** between features
   - Multicollinearity
   - One might be redundant

3. **Unexpected** correlations
   - Might reveal data issues
   - Or interesting patterns

#### **Other Correlation Types** (2 min)

**Spearman Correlation:**
- Rank-based
- Captures monotonic (not just linear) relationships
- Use for: Ordinal data, non-linear patterns

**Point-Biserial:**
- One continuous, one binary
- Example: Age vs. Purchased (yes/no)

**Visual Demo:** (1 min)
Show 6 scatter plots with different r values
(-1.0, -0.5, 0, +0.3, +0.7, +1.0)

---

### **Module 2.5: Visualization Best Practices** (8 min)

#### **Choosing the Right Chart** (4 min)

**Decision Tree:**
```
What do you want to show?
├─ Distribution of one variable
│  ├─ Continuous → Histogram, KDE, Box plot
│  └─ Categorical → Bar chart, Pie chart
├─ Relationship between two variables
│  ├─ Both continuous → Scatter plot, Hex bin
│  ├─ One continuous, one categorical → Box plot, Violin plot
│  └─ Both categorical → Heatmap, Mosaic plot
├─ Trends over time
│  └─ Line chart, Area chart
├─ Comparisons
│  └─ Bar chart (horizontal or vertical)
└─ Part-to-whole
   └─ Pie chart, Stacked bar, Treemap
```

#### **Design Principles** (4 min)

**1. Clarity** (1 min)
- Clear labels (axis, title, legend)
- Appropriate font sizes
- No chart junk

**2. Honesty** (1 min)
- Start y-axis at 0 (for bar charts)
- Don't cherry-pick scales
- Show uncertainty (error bars)

**3. Color** (1 min)
- Use color purposefully
- Colorblind-friendly palettes
- Maximum 5-7 colors

**4. Context** (1 min)
- Add reference lines
- Annotate key points
- Compare to benchmark

**Bad vs. Good Examples:**
Show 2-3 examples of misleading vs. clear charts

---

## 🕒 PART 3: FEATURE ENGINEERING & SELECTION (45 minutes)

### **Module 3.1: Introduction to Feature Engineering** (5 min)

#### **The Most Important Skill** (2 min)
> "Applied machine learning is basically feature engineering." - Andrew Ng

**Why it matters:**
- Can improve accuracy by 20-30%
- More impactful than algorithm choice
- Requires domain knowledge + creativity

#### **Types of Feature Engineering** (3 min)
1. **Extraction:** Pull features from raw data
2. **Transformation:** Modify existing features
3. **Creation:** Combine features for new ones
4. **Selection:** Choose best features

---

### **Module 3.2: Feature Extraction** (12 min)

#### **From Text** (4 min)

**Simple Features:**
```python
df['text_length'] = df['text'].str.len()
df['word_count'] = df['text'].str.split().str.len()
df['has_exclamation'] = df['text'].str.contains('!').astype(int)
```

**Advanced Features:**
- Bag of Words (BoW)
- TF-IDF
- Word embeddings (Word2Vec, BERT)

**Demo:** Spam detection features

#### **From Dates** (4 min)

**Rich Temporal Features:**
```python
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day'] = df['date'].dt.day
df['day_of_week'] = df['date'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6])
df['quarter'] = df['date'].dt.quarter
df['is_month_start'] = df['date'].dt.is_month_start
df['is_holiday_season'] = df['month'].isin([11, 12])
```

**Use case:** Sales prediction
- Weekends: Different patterns
- Holidays: Spikes
- Seasonality: Monthly trends

#### **From Images** (2 min)
- Color histograms
- Edge detection (Sobel, Canny)
- Texture features (Gabor filters)
- Pre-trained models (ResNet features)

#### **From Location** (2 min)
```python
df['distance_to_city_center'] = calculate_distance(df[['lat', 'lon']])
df['is_urban'] = df['population_density'] > 1000
df['nearby_amenities'] = count_amenities(df[['lat', 'lon']])
```

---

### **Module 3.3: Feature Transformation** (10 min)

#### **Why Transform?** (2 min)
- Make data more "normal"
- Handle skewness
- Capture non-linear relationships
- Stabilize variance

#### **Transformation Types** (8 min)

**1. Log Transform** (2 min)
```python
df['log_income'] = np.log1p(df['income'])
```
- Use for: Right-skewed data (income, prices)
- Effect: Compresses large values
- **When:** Skewness > 1

**Before/After Visual:**
Show income distribution

**2. Square Root Transform** (1 min)
```python
df['sqrt_area'] = np.sqrt(df['area'])
```
- Milder than log
- Good for: Count data

**3. Polynomial Features** (2 min)
```python
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)
```

**Example:**
- Original: [age]
- Degree 2: [age, age²]
- Use for: Capturing curves (U-shapes)

**Real example:** Salary vs. Experience
- Linear: Doesn't fit well
- With age²: Captures initial growth then plateau

**4. Binning (Discretization)** (2 min)
```python
df['age_group'] = pd.cut(df['age'], 
                          bins=[0, 18, 35, 50, 100],
                          labels=['Young', 'Adult', 'Middle', 'Senior'])
```

**When to use:**
- Non-linear relationships
- Reduce noise
- Match business rules

**5. Interactions** (1 min)
```python
df['price_per_sqft'] = df['price'] / df['sqft']
df['bedroom_bath_ratio'] = df['bedrooms'] / df['bathrooms']
```

**Intuition:** Sometimes combination matters more than individuals

---

### **Module 3.4: Feature Selection** (12 min)

#### **Why Select Features?** (3 min)

**Problems with too many features:**
1. **Curse of dimensionality:** More features = need more data
2. **Overfitting:** Model memorizes noise
3. **Computation:** Slower training
4. **Interpretation:** Harder to explain

**Rule of thumb:** 10 samples per feature

#### **Selection Methods** (9 min)

**Method 1: Filter Methods** (3 min)

**How:** Use statistical tests before modeling

**Techniques:**
- Correlation with target
- Chi-square test
- ANOVA F-test
- Mutual information

```python
from sklearn.feature_selection import SelectKBest, f_classif
selector = SelectKBest(score_func=f_classif, k=10)
X_selected = selector.fit_transform(X, y)
```

**Pros:** Fast, simple
**Cons:** Ignores feature interactions

**Method 2: Wrapper Methods** (3 min)

**How:** Test different feature subsets with actual model

**Techniques:**
- Forward selection (add one at a time)
- Backward elimination (remove one at a time)
- Recursive Feature Elimination (RFE)

```python
from sklearn.feature_selection import RFE
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier()
rfe = RFE(model, n_features_to_select=10)
rfe.fit(X, y)
selected_features = X.columns[rfe.support_]
```

**Pros:** Considers interactions
**Cons:** Computationally expensive

**Method 3: Embedded Methods** (3 min)

**How:** Feature selection during model training

**Techniques:**
- Lasso (L1 regularization) → Zeros out coefficients
- Random Forest → Feature importance
- XGBoost → Gain/coverage importance

```python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100)
rf.fit(X, y)

# Get importance
importances = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
```

**Pros:** Fast, automatic
**Cons:** Model-specific

---

### **Module 3.5: Dimensionality Reduction** (6 min)

#### **The Concept** (2 min)
**Goal:** Reduce features while keeping information

**Analogy:** Taking a 3D object and photographing it from the best angle
- Lost: 3rd dimension
- Kept: Most information

#### **Principal Component Analysis (PCA)** (3 min)

**How it works:**
1. Find direction of maximum variance (PC1)
2. Find next orthogonal direction (PC2)
3. Continue...

**Result:** New features (components) that are combinations of original

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Variance explained
print(pca.explained_variance_ratio_)  # [0.72, 0.18] = 90% total
```

**Visualization:** Show 100D data → 2D plot with clusters visible

**When to use:**
- Have many correlated features
- Want to visualize high-D data
- Reduce noise

**Caveat:** Lose interpretability (PC1 = 0.3×age + 0.5×income - 0.2×...)

#### **t-SNE** (1 min)

**Purpose:** Visualization only!

```python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X)
```

**Reveals:** Hidden clusters
**Don't use:** For actual modeling!

---

## 🕓 PART 4: Q&A & PRACTICAL EXERCISE (30 minutes)

### **Recap** (5 min)

**The Complete Pipeline:**
```
1. Load Data
   ↓
2. Explore (EDA)
   ├─ Summary statistics
   ├─ Distributions
   ├─ Correlations
   └─ Visualizations
   ↓
3. Clean
   ├─ Handle missing values
   ├─ Remove/cap outliers
   └─ Smooth noise
   ↓
4. Scale
   └─ Choose appropriate scaler
   ↓
5. Engineer Features
   ├─ Extract from raw data
   ├─ Transform existing
   └─ Create interactions
   ↓
6. Select Features
   ├─ Remove irrelevant
   ├─ Reduce dimensions
   └─ Choose best subset
   ↓
7. Ready for Modeling!
```

---

### **Q&A Session** (10 min)

**Common Questions to Address:**

1. **"Should I always remove outliers?"**
   - No! First investigate. Are they errors or real?

2. **"Which scaler should I use?"**
   - Default: StandardScaler
   - Have outliers: RobustScaler
   - Need [0,1]: MinMaxScaler

3. **"How many features should I keep?"**
   - Start with all, then prune based on:
     - Feature importance
     - Cross-validation performance
     - Domain knowledge

4. **"Can I skip EDA?"**
   - Never! EDA prevents costly mistakes

5. **"What if I have both numerical and categorical features?"**
   - Scale numerical separately
   - Encode categorical (one-hot, label, target)

---

### **Hands-On Exercise** (15 min)

**Challenge:** Given a messy real-world dataset, students will:

**Dataset:** Titanic survivor data (classic example)

**Tasks:**
1. **Explore** (3 min)
   - Find missing values
   - Check distributions
   - Calculate correlations

2. **Clean** (5 min)
   - Impute Age (choose method)
   - Handle missing Cabin
   - Remove irrelevant columns

3. **Engineer** (4 min)
   - Extract Title from Name
   - Create FamilySize
   - Bin Fare into categories

4. **Select** (3 min)
   - Find top 5 features
   - Justify your choices

**Solution Walkthrough:**
- Share screens
- Discuss different approaches
- Highlight creative solutions

---

## 📚 Additional Resources

### **Books:**
1. "Python Data Science Handbook" - Jake VanderPlas
2. "Feature Engineering for Machine Learning" - Alice Zheng
3. "Storytelling with Data" - Cole Nussbaumer Knaflic

### **Online:**
1. Kaggle Learn: Data Cleaning, Feature Engineering
2. Towards Data Science blog
3. Jason Brownlee's Machine Learning Mastery

### **Practice Datasets:**
1. Kaggle competitions
2. UCI Machine Learning Repository
3. Google Dataset Search

---

## 🎯 Final Takeaways

### **The Golden Rules:**

1. **NEVER skip EDA!**
   - Prevents hours of debugging
   - Reveals hidden insights

2. **Clean before you scale**
   - Handle missing → Remove outliers → Scale

3. **Fit on train, transform on test**
   - Prevent data leakage
   - Save your scalers/encoders

4. **Document everything**
   - Future you will thank present you
   - Others need to understand your choices

5. **Iterate and experiment**
   - Try multiple approaches
   - Let data guide you

6. **Domain knowledge matters**
   - Best features come from understanding the problem
   - Talk to subject matter experts

### **Next Steps:**
1. Complete the Jupyter notebooks
2. Try the interactive web tool
3. Practice on real datasets
4. Join Kaggle competitions

---

## 📊 Appendix: Cheat Sheets

### **Missing Values Decision Tree:**
```
Is missing < 5%?
├─ YES: Safe to delete rows
└─ NO: Is it random?
    ├─ YES: Impute (mean/median/KNN)
    └─ NO: Investigate pattern
        ├─ Related to target? → Create indicator variable
        └─ Not related? → Advanced imputation (MICE)
```

### **Outlier Handling Decision Tree:**
```
Is it an error?
├─ YES: Remove
└─ NO: Do you have many data points?
    ├─ YES: Keep outliers
    └─ NO: Is it affecting model?
        ├─ YES: Transform (log) or cap
        └─ NO: Keep outliers
```

### **Scaling Decision Matrix:**
| Algorithm | Need Scaling? | Recommended Method |
|-----------|---------------|-------------------|
| Linear Regression | Yes | StandardScaler |
| Logistic Regression | Yes | StandardScaler |
| KNN | Yes | StandardScaler |
| SVM | Yes | StandardScaler |
| Neural Network | Yes | MinMaxScaler |
| Decision Tree | No | None |
| Random Forest | No | None |
| XGBoost | No | None |
| PCA | Yes | StandardScaler |
| K-Means | Yes | StandardScaler |

### **Feature Engineering Ideas by Data Type:**

**Numerical:**
- Log transform (skewed data)
- Polynomial features (non-linear)
- Binning (discretize)
- Ratios (feature1/feature2)
- Differences (feature1 - feature2)

**Categorical:**
- One-hot encoding
- Label encoding (ordinal)
- Target encoding
- Frequency encoding
- Binary encoding

**DateTime:**
- Year, Month, Day
- Day of week
- Hour, Minute
- Is weekend/holiday
- Time since event
- Cyclic encoding (sin/cos)

**Text:**
- Length, word count
- Bag of Words
- TF-IDF
- Sentiment score
- Named entities
- Word embeddings

**Geospatial:**
- Distance to landmark
- Cluster assignment
- Density
- Elevation
- Region category

---

## 🎓 Assessment Questions

### **Quick Knowledge Check:**

1. You have 1000 rows with 10% missing values in income. Mean = $50k, but there are 3 billionaires. What imputation method and why?

2. Your KNN model has 60% accuracy without scaling and 85% with scaling. Why the difference?

3. Two features have correlation = 0.95. What does this mean for your model?

4. When should you use RobustScaler instead of StandardScaler?

5. What's wrong with: `scaler.fit_transform(pd.concat([X_train, X_test]))`?

---

**END OF LECTURE**

*Remember: Data preprocessing is not a one-time task. It's iterative, creative, and crucial for success!*
