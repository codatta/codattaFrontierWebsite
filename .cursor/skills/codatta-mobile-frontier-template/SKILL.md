---
name: codatta-mobile-frontier-template
description: Build mobile light-theme form pages with a specific design system. Use when creating mobile web pages, app-style form UIs, data collection templates, or task submission pages for mobile. Provides exact CSS values, component patterns (header, bottom drawer, success modal), and form state management for faithful UI reproduction.
---

# Mobile Light-Theme Template

Guide for building mobile-first light-theme form/task pages. All styling uses **CSS Modules** (`.module.css`). No Tailwind, no Ant Design.

## Design Tokens

Add to a shared `tokens.css` or the page's `.module.css`:

```css
:root {
  /* Backgrounds */
  --color-bg-page: #F8F8F8;
  --color-bg-card: #FFFFFF;
  --color-bg-card-alt: #F5F5F5;

  /* Accent */
  --color-accent: #40E1EF;
  --color-accent-bg: rgba(64, 225, 239, 0.08);

  /* Text */
  --color-text-primary: #000000;
  --color-text-secondary: #999999;
  --color-text-placeholder: rgba(60, 60, 67, 0.3);

  /* Borders */
  --color-border-divider: rgba(0, 0, 0, 0.05);

  /* Status */
  --color-error: #D92B2B;

  /* Shadows */
  --shadow-glass: inset 1px 1px 1px rgba(255, 255, 255, 0.8),
    inset -1px -1px 0.5px rgba(255, 255, 255, 0.4),
    1px 1px 10px rgba(60, 60, 0, 0.05),
    0px 0px 8px rgba(60, 60, 0, 0.05);

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
  padding-bottom: 80px;
}

/* --- Fixed Header --- */
.headerSpacer {
  height: 76px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  padding: 16px;
  background: linear-gradient(
    to bottom,
    #F8F8F8 0%,
    rgba(248, 248, 248, 0.73) 50%,
    transparent 100%
  );
}

.headerIconBtn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(249, 249, 249, 0.19);
  box-shadow: var(--shadow-glass);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
}

.headerIconBtnAccent {
  composes: headerIconBtn;
  background: rgba(64, 225, 239, 0.9);
  color: #fff;
}
.headerIconBtnAccent:disabled {
  background: rgba(0, 0, 0, 0.05);
  color: #bbb;
}

.headerTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 17px;
  font-weight: 700;
}

/* --- Body --- */
.body {
  padding: 0 20px;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}
```

### PageTemplate.tsx

```tsx
import { useState, useMemo } from 'react'
import { ChevronLeft, ArrowUp } from 'lucide-react'
import styles from './PageTemplate.module.css'

interface FormData {
  fieldA: string
  fieldB: string
}

export default function PageTemplate() {
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [formData, setFormData] = useState<FormData>({ fieldA: '', fieldB: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const allFieldsFilled = useMemo(() => {
    return formData.fieldA.trim() !== '' && formData.fieldB.trim() !== ''
  }, [formData])

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.fieldA.trim()) newErrors.fieldA = 'Required'
    if (!formData.fieldB.trim()) newErrors.fieldB = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      // await api.submit(...)
      setFormData({ fieldA: '', fieldB: '' })
      setModalShow(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => window.history.back()

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerSpacer} />
      <div className={styles.header}>
        <button className={styles.headerIconBtn} onClick={goBack}>
          <ChevronLeft size={24} />
        </button>
        <div className={styles.headerTitle}>Page Title</div>
        <button
          className={styles.headerIconBtnAccent}
          disabled={!allFieldsFilled || loading}
          onClick={handleSubmit}
        >
          <ArrowUp size={24} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.sections}>
          {/* Form sections go here */}
        </div>

        <button
          className={`${styles.primaryBtn} ${
            allFieldsFilled ? styles.primaryBtnEnabled : styles.primaryBtnDisabled
          }`}
          onClick={handleSubmit}
          disabled={!allFieldsFilled || loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {modalShow && <SuccessModal onClose={goBack} />}
    </div>
  )
}
```

## Form Elements

### FormElements.module.css

```css
/* --- Section label --- */
.sectionLabel {
  display: block;
  padding: 0 16px;
  font-size: 17px;
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

/* --- Grouped field list (iOS settings style) --- */
.fieldList {
  border-radius: 26px;
  background: #fff;
  padding: 4px 16px;
}
.fieldRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-divider);
}
.fieldRow:last-child {
  border-bottom: none;
}
.fieldRowLabel {
  font-size: 17px;
  color: var(--color-text-primary);
}

/* --- Standalone text input --- */
.input {
  height: 52px;
  width: 100%;
  border-radius: 26px;
  background: #fff;
  padding: 0 24px;
  font-size: 16px;
  color: #000;
  outline: none;
  border: none;
}
.input::placeholder {
  color: var(--color-text-placeholder);
}
.inputError {
  border: 1px solid var(--color-error);
}

/* --- Textarea --- */
.textarea {
  width: 100%;
  border-radius: 26px;
  background: #fff;
  padding: 16px;
  font-size: 17px;
  color: #000;
  outline: none;
  border: none;
  resize: none;
  min-height: 120px;
}
.textarea::placeholder {
  color: var(--color-text-placeholder);
}

/* --- Inline select (inside fieldRow) --- */
.inlineSelectWrapper {
  position: relative;
  flex: 1;
}
.inlineSelect {
  appearance: none;
  background: #fff;
  border: none;
  outline: none;
  padding: 12px 24px 12px 0;
  font-size: 17px;
  color: var(--color-text-secondary);
  text-align: right;
  width: 100%;
  cursor: pointer;
}
.inlineSelect:invalid {
  color: var(--color-text-placeholder);
}
.inlineSelectArrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  width: 16px;
  height: 16px;
}

/* --- Error message --- */
.errorText {
  padding: 0 16px;
  font-size: 12px;
  color: var(--color-error);
}

/* --- Primary button --- */
.primaryBtn {
  height: 56px;
  width: 100%;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.primaryBtnEnabled {
  background: #000;
  color: #fff;
  box-shadow: var(--shadow-glass);
}
.primaryBtnDisabled {
  background: rgba(160, 160, 160, 0.4);
  color: #fff;
  cursor: not-allowed;
}

/* Alternative disabled style */
.primaryBtnDisabledAlt {
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.6);
  cursor: not-allowed;
}
```

### Form field JSX patterns

**Grouped field list (iOS settings style)**:

```tsx
<div className={styles.fieldList}>
  {/* Select row */}
  <div className={styles.fieldRow}>
    <span className={styles.fieldRowLabel}>Gender</span>
    <div className={styles.inlineSelectWrapper}>
      <select
        className={styles.inlineSelect}
        value={formData.gender}
        onChange={e => updateFormData('gender', e.target.value)}
        style={{ color: formData.gender ? '#999' : undefined }}
      >
        <option value="" disabled>Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <ChevronsUpDown className={styles.inlineSelectArrow} />
    </div>
  </div>

  {/* Text display row */}
  <div className={styles.fieldRow}>
    <span className={styles.fieldRowLabel}>Date of Birth</span>
    <span style={{ fontSize: 17, color: '#999' }}>{formData.birthDate || 'Select'}</span>
  </div>
</div>
```

**Standalone input with label**:

```tsx
<div>
  <label className={styles.sectionLabel}>Educational Background</label>
  <textarea
    className={styles.textarea}
    value={formData.education}
    onChange={e => updateFormData('education', e.target.value)}
    placeholder="e.g., degrees, schools, key achievements..."
    maxLength={1000}
  />
  {errors.education && <p className={styles.errorText}>{errors.education}</p>}
</div>
```

## Option Card

For multi-choice selection grids:

### OptionCard.module.css

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 84px;
  border-radius: 20px;
  border: 1px solid #fff;
  background: #fff;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.cardSelected {
  composes: card;
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
}
.cardLabel {
  font-size: 17px;
  color: var(--color-text-primary);
  margin: 8px 0;
}
.cardDescription {
  font-size: 13px;
  line-height: 15px;
  color: var(--color-text-secondary);
}
```

### JSX

```tsx
<div className={styles.grid}>
  {options.map(opt => (
    <button
      key={opt.value}
      className={selected === opt.value ? styles.cardSelected : styles.card}
      onClick={() => onSelect(opt.value)}
    >
      <div>{opt.icon && <opt.icon />}</div>
      <div className={styles.cardLabel}>{opt.label}</div>
      {opt.description && <p className={styles.cardDescription}>{opt.description}</p>}
    </button>
  ))}
</div>
```

## Bottom Drawer

### BottomDrawer.module.css

```css
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-out;
}
.backdropHidden {
  opacity: 0;
}
.backdropVisible {
  opacity: 1;
}

.drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  max-height: 90vh;
  overflow: hidden;
  border-radius: 26px 26px 0 0;
  background: #fff;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-out;
}
.drawerHidden {
  transform: translateY(100%);
}
.drawerVisible {
  transform: translateY(0);
}

.content {
  max-height: calc(90vh - 80px);
  overflow-y: auto;
  padding: 0 20px 16px;
}
```

### BottomDrawer.tsx

```tsx
import { useEffect, useState, ReactNode } from 'react'
import styles from './BottomDrawer.module.css'

interface Props {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export default function BottomDrawer({ open, onClose, children, className }: Props) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      setTimeout(() => setAnimating(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 300)
      document.body.style.overflow = ''
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!visible) return null

  return (
    <>
      <div
        className={`${styles.backdrop} ${animating ? styles.backdropVisible : styles.backdropHidden}`}
        onClick={onClose}
      />
      <div
        className={`${styles.drawer} ${animating ? styles.drawerVisible : styles.drawerHidden} ${className || ''}`}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </>
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
  transition: all 0.3s ease-out;
}
.backdropHidden {
  opacity: 0;
  backdrop-filter: blur(0);
}
.backdropVisible {
  opacity: 1;
  background: rgba(153, 153, 153, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wrapper {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  width: 100%;
  max-width: 322px;
  border-radius: 42px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: var(--shadow-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 24px;
  text-align: center;
  color: var(--color-text-primary);
  transition: all 0.3s ease-out;
}
.modalHidden {
  opacity: 0;
  transform: scale(0.95);
}
.modalVisible {
  opacity: 1;
  transform: scale(1);
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.pointsValue {
  font-size: 42px;
  font-weight: 700;
  line-height: 42px;
  color: var(--color-accent);
}

.message {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.button {
  width: 100%;
  border-radius: 9999px;
  background: #000;
  color: #fff;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
```

### SuccessModal.tsx

```tsx
import { useEffect, useState } from 'react'
import styles from './SuccessModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
  points?: number
  buttonText?: string
}

export default function SuccessModal({
  open,
  onClose,
  title = 'Successful',
  message = 'Your submission has been received successfully.',
  points,
  buttonText = 'Got it'
}: Props) {
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setVisible(true)
      setTimeout(() => setAnimating(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      setAnimating(false)
      const t = setTimeout(() => setVisible(false), 300)
      document.body.style.overflow = ''
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!visible) return null

  return (
    <>
      <div
        className={`${styles.backdrop} ${animating ? styles.backdropVisible : styles.backdropHidden}`}
        onClick={onClose}
      />
      <div className={styles.wrapper}>
        <div
          className={`${styles.modal} ${animating ? styles.modalVisible : styles.modalHidden}`}
          onClick={e => e.stopPropagation()}
        >
          {points !== undefined && points > 0 ? (
            <>
              <h2 className={styles.title}>
                <span className={styles.pointsValue}>+{points}</span> Points
              </h2>
              <p className={styles.message}>
                Other rewards will issue automatically after verification.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.message}>{message}</p>
            </>
          )}
          <button className={styles.button} onClick={onClose}>{buttonText}</button>
        </div>
      </div>
    </>
  )
}
```

## Key Conventions

- **Font**: Inter, sans-serif
- **Page bg**: `#F8F8F8` (light gray)
- **Card bg**: `#FFFFFF` (white), with `border-radius: 26px`
- **Accent**: `#40E1EF` (cyan) -- used for submit icon, selected option borders, points display
- **Primary button**: black `#000`, `height: 56px`, full-width, `border-radius: 9999px`, with `--shadow-glass`
- **Section labels**: `font-size: 17px; color: #999; padding: 0 16px;` -- placed above field groups
- **Field groups**: white card with `border-radius: 26px`, rows separated by `rgba(0,0,0,0.05)` dividers
- **Select fields**: native `<select>` with `appearance: none`, right-aligned value in `#999`, chevron icon overlay
- **Spacing**: body `padding: 0 20px`, section gap `24px`, bottom padding `80px`
- **Error text**: `font-size: 12px; color: #D92B2B; padding: 0 16px;`
- **Navigation back**: `window.history.back()` or native bridge `window.native?.call('goBack')`
- **Frosted glass effect**: Use `--shadow-glass` + `backdrop-filter: blur()` for modal/header buttons
