---
name: codatta-pc-frontier-template
description: Build PC/desktop dark-theme form pages with a specific design system. Use when creating desktop web pages, dark-themed form UIs, data collection templates, or task submission pages. Provides exact CSS values, component patterns, and form state management for faithful UI reproduction.
---

# PC Dark-Theme Template

Guide for building desktop dark-theme form/task pages. All styling uses **CSS Modules** (`.module.css`). No Tailwind, no Ant Design.

## Design Tokens

Add to a shared `tokens.css` or the page's `.module.css`:

```css
:root {
  /* Backgrounds */
  --color-bg-page: #1C1C26;
  --color-bg-card: #252532;
  --color-bg-subtle: rgba(255, 255, 255, 0.04);

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.12);
  --color-border-subtle: rgba(255, 255, 255, 0.04);

  /* Accent */
  --color-accent: #875DFF;
  --color-accent-bg: rgba(135, 93, 255, 0.2);

  /* Text */
  --color-text-primary: #FFFFFF;
  --color-text-muted: #8D8D93;
  --color-text-secondary: #9CA3AF;
  --color-text-placeholder: #606067;

  /* Status */
  --color-error: #D92B2B;
  --color-success: #5DDD22;

  /* Typography */
  --font-family: 'Inter', sans-serif;
}
```

## Page Skeleton

### PageTemplate.module.css

```css
.page {
  min-height: 100vh;
  background: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.header {
  display: flex;
  height: 84px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  padding: 16px 24px;
}

.backButton {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  background: none;
  border: none;
  width: 80px;
}
.backButton:hover {
  color: #fff;
}

.headerTitle {
  font-size: 16px;
  font-weight: 700;
}

.headerRight {
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: flex-end;
}

.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.content {
  margin-top: 48px;
}

.formSections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
```

### PageTemplate.tsx

```tsx
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './PageTemplate.module.css'

interface FormData {
  fieldA: string
  fieldB: string
}

export default function PageTemplate() {
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [formData, setFormData] = useState<FormData>({ fieldA: '', fieldB: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const allFieldsFilled = useMemo(() => {
    return formData.fieldA.trim() !== '' && formData.fieldB.trim() !== ''
  }, [formData])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.fieldA.trim()) newErrors.fieldA = 'Field A is required'
    if (!formData.fieldB.trim()) newErrors.fieldB = 'Field B is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      // await api.submitTask(taskId, { data: formData, templateId, taskId })
      setFormData({ fieldA: '', fieldB: '' })
      setModalShow(true)
    } catch (error) {
      console.error('Submit failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className={styles.headerTitle}>Page Title</div>
        <div className={styles.headerRight} />
      </div>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.formSections}>
            {/* Form fields go here */}
          </div>
        </div>
      </div>

      {loading && <LoadingOverlay />}
      {modalShow && <SuccessModal onClose={() => window.history.back()} />}
    </div>
  )
}
```

## Form Elements

### FormElements.module.css

```css
/* --- Field group --- */
.fieldGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* --- Label --- */
.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.required {
  color: var(--color-error);
}

/* --- Text input --- */
.input {
  width: 100%;
  height: 44px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: var(--color-accent);
}
.input::placeholder {
  color: var(--color-text-placeholder);
}
.inputError {
  border-color: var(--color-error);
}

/* --- Select --- */
.selectWrapper {
  position: relative;
}
.select {
  width: 100%;
  height: 44px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0 40px 0 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.select:focus {
  border-color: var(--color-accent);
}
.selectArrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-muted);
}

/* --- Textarea --- */
.textarea {
  width: 100%;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;
}
.textarea:focus {
  border-color: var(--color-accent);
}
.textarea::placeholder {
  color: var(--color-text-placeholder);
}

/* --- Error message --- */
.errorText {
  font-size: 14px;
  color: var(--color-error);
}

/* --- Submit button --- */
.submitButton {
  height: 44px;
  width: 240px;
  border-radius: 9999px;
  margin: 48px auto 0;
  display: block;
  background: var(--color-accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.submitButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Form field JSX pattern

```tsx
{/* Text input */}
<div className={styles.fieldGroup}>
  <label className={styles.label}>
    Field Name<span className={styles.required}>*</span>
  </label>
  <input
    type="text"
    className={`${styles.input} ${errors.fieldA ? styles.inputError : ''}`}
    value={formData.fieldA}
    onChange={e => updateFormData('fieldA', e.target.value)}
    placeholder="Enter value"
    maxLength={64}
  />
  {errors.fieldA && <p className={styles.errorText}>{errors.fieldA}</p>}
</div>

{/* Select */}
<div className={styles.fieldGroup}>
  <label className={styles.label}>
    Category<span className={styles.required}>*</span>
  </label>
  <div className={styles.selectWrapper}>
    <select
      className={styles.select}
      value={formData.fieldB}
      onChange={e => updateFormData('fieldB', e.target.value)}
    >
      <option value="" disabled>Select</option>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </select>
    <ChevronDown size={16} className={styles.selectArrow} />
  </div>
</div>

{/* Textarea */}
<div className={styles.fieldGroup}>
  <label className={styles.label}>Description</label>
  <textarea
    className={styles.textarea}
    value={formData.fieldC}
    onChange={e => updateFormData('fieldC', e.target.value)}
    placeholder="Enter description..."
    rows={6}
    maxLength={1000}
  />
</div>

{/* Submit */}
<button
  className={styles.submitButton}
  onClick={handleSubmit}
  disabled={!allFieldsFilled || loading}
>
  {loading ? 'Submitting...' : 'Submit'}
</button>
```

## Card Component

For guideline sections or grouped content:

```css
/* Card.module.css */
.card {
  border-radius: 16px;
  background: var(--color-bg-card);
  padding: 24px;
}
.cardBordered {
  composes: card;
  border: 1px solid var(--color-border-subtle);
}

/* Guideline / info section */
.infoSection {
  background: var(--color-bg-subtle);
  padding: 30px 0;
}
.infoTitle {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}
.infoText {
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-muted);
  margin-top: 8px;
}
```

## Loading Spinner

### Spinner.module.css

```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(28, 28, 38, 0.6);
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Spinner.tsx

```tsx
import styles from './Spinner.module.css'
export default function LoadingOverlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  )
}
```

## Success Modal

### SuccessModal.module.css

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}
.modal {
  border-radius: 24px;
  background: var(--color-bg-card);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}
.message {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}
.button {
  width: 100%;
  height: 44px;
  border-radius: 9999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
```

### SuccessModal.tsx

```tsx
import styles from './SuccessModal.module.css'

interface Props {
  title?: string
  message?: string
  onClose: () => void
}

export default function SuccessModal({
  title = 'Successful',
  message = 'Your submission has been received successfully.',
  onClose
}: Props) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.button} onClick={onClose}>Got it</button>
      </div>
    </div>
  )
}
```

## Key Conventions

- **Font**: Inter, sans-serif
- **Page bg**: `#1C1C26` (dark blue-gray)
- **Card bg**: `#252532` (slightly lighter)
- **Accent**: `#875DFF` (purple) -- used for primary buttons, links, focus rings, badges
- **Badge pattern**: `border-radius: 9999px; background: var(--color-accent-bg); color: var(--color-accent); padding: 2px 12px; font-size: 14px; font-weight: 600;`
- **Borders**: always `rgba(255,255,255,0.12)` or `rgba(255,255,255,0.04)` -- never solid white
- **Back button style**: icon + "Back" text, color `rgba(255,255,255,0.6)`, hover `#fff`
- **Error text**: `#D92B2B`, shown below the input, `font-size: 14px`
- **Section spacing**: `gap: 30px` between form field groups, `margin-top: 48px` for content below header
- **Max content width**: `1320px`, centered with `margin: 0 auto; padding: 0 24px;`
