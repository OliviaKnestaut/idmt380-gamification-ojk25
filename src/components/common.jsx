import React from 'react';
import {
  Card as MuiCard,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  ExpandLess,
  ExpandMore,
  RemoveCircleOutline,
  WorkspacePremium,
} from '@mui/icons-material';
import { coverIntro, sectionDescriptions, steps } from '../data';

export function Header() {
  return (
    <header className="header">
      <h1>Make a Plan with Ready.gov</h1>
      <strong>
        <em>
          The information you provide is not saved, stored or shared by any
          government agency.
        </em>
      </strong>
      <p>
        You may not be together when disaster strikes, so it's important to
        know how you'll reconnect if separated. Use this form to create a Family Emergency Communication
        Plan, which you can email as a PDF file once complete.
      </p>
      <p>
        All fields are optional because every household has different needs. Enter as much applicable information as you can in each section to build a robust
        plan to share with your household members.
      </p>
    </header>
  );
}

export function Shell({
  children,
  step,
  title,
  description,
  onNext,
  onPrevious,
  nextLabel = 'Next Section',
}) {
  return (
    <MuiCard component="section" className="card">
      <Progress step={step} />
      <h2>{title}</h2>
      <p className="description">{description}</p>
      {children}
      <nav className="nav-buttons">
        <Button onClick={onPrevious} icon={<ArrowBack />}>
          Previous Section
        </Button>
        <Button onClick={onNext} icon={<ArrowForward />} endIcon>
          {nextLabel}
        </Button>
      </nav>
    </MuiCard>
  );
}

export function Progress({ step }) {
  const percent = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div
      className="journey"
      aria-label={`Step ${step + 1} of ${steps.length}`}
    >
      <div className="journey-track">
        {steps.map((label, index) => (
          <div
            className={`journey-step ${
              index === step ? 'active' : ''
            } ${index < step ? 'complete' : ''}`}
            key={label}
          >
            <span className="journey-node">
              {index < step ? <CheckCircle /> : index === 5 ? <WorkspacePremium /> : <CheckCircle />}
            </span>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Button({ children, onClick, icon, endIcon, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      className="green-button"
      onClick={onClick}
      disabled={disabled}
    >
      {!endIcon && icon}
      {children}
      {endIcon && icon}
    </button>
  );
}

export function Field({
  placeholder,
  value,
  onChange,
  area = false,
  phone = false,
}) {
  const change = (event) => {
    const nextValue = phone ? formatPhone(event.target.value) : event.target.value;
    onChange(nextValue);
  };

  if (area) {
    return (
      <textarea
        placeholder={placeholder}
        value={value || ''}
        onChange={change}
      />
    );
  }

  return (
    <input
      placeholder={placeholder}
      value={value || ''}
      onChange={change}
    />
  );
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length < 4) return digits;
  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function Subheading({ children }) {
  return <h3>{children}</h3>;
}

export function CollapsibleItem({ open, onToggle, onRemove, children }) {
  return (
    <div className={`repeat ${open ? '' : 'collapsed'}`}>
      <button
        type="button"
        className="collapse-toggle"
        onClick={onToggle}
        aria-label={open ? 'Collapse item' : 'Expand item'}
      >
        {open ? <ExpandLess /> : <ExpandMore />}
      </button>
      {onRemove && (
        <button
          type="button"
          className="remove-button"
          onClick={onRemove}
          aria-label="Remove item"
        >
          <RemoveCircleOutline />
        </button>
      )}
      {children}
    </div>
  );
}

export function AddButton({ children, onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      <Add />
      {children}
    </button>
  );
}

export function ContactFields({ item, section, index, update }) {
  return (
    <>
      <Field
        placeholder="Name"
        value={item.name}
        onChange={(value) => update(section, 'name', value, index)}
      />
      {section === 'members' && (
        <FormControlLabel
          className="household-toggle"
          control={
            <Checkbox
              checked={Boolean(item.householdMember)}
              onChange={(event) =>
                update(section, 'householdMember', event.target.checked, index)
              }
            />
          }
          label="Household member"
        />
      )}
      <div className="nested">
        <Field
          placeholder="Mobile Phone Number"
          phone
          value={item.mobile}
          onChange={(value) => update(section, 'mobile', value, index)}
        />
        <Field
          placeholder="Other Phone Number"
          phone
          value={item.otherPhone}
          onChange={(value) => update(section, 'otherPhone', value, index)}
        />
        <Field
          placeholder="Email"
          value={item.email}
          onChange={(value) => update(section, 'email', value, index)}
        />
        {(section !== 'members' || !item.householdMember) && (
          <Field
            placeholder="Address"
            value={item.address}
            onChange={(value) => update(section, 'address', value, index)}
          />
        )}
        <Field
          placeholder="Notes or Important Information"
          value={item.notes}
          area
          onChange={(value) => update(section, 'notes', value, index)}
        />
      </div>
    </>
  );
}

export function Cover({ onStart }) {
  return (
    <MuiCard component="section" className="card cover">
      <h2>Ready to Get Started?</h2>
      <p>{coverIntro}</p>
      <p>You will need the following information to complete your plan:</p>
      <ul>
        <li>Household Information</li>
        <li>Family Member and Emergency Contact Details</li>
        <li>Medical, Prescription,and Insurance Information</li>
        <li>Important Locations and Meeting Places</li>
      </ul>
      <div className="cover-button">
        <Button onClick={onStart} icon={<ArrowForward />}>
          Get Started
        </Button>
      </div>
    </MuiCard>
  );
}
