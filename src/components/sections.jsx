import React, { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import { blank, sectionDescriptions, states } from '../data';
import {
  AddButton,
  CollapsibleItem,
  ContactFields,
  Field,
  Shell,
  Subheading,
} from './common';

export function Household({ data, update, onNext, onPrevious }) {
  return (
    <Shell
      step={0}
      title="Household Information"
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <Subheading>Address Information</Subheading>
      <Field
        placeholder="Address Line 1"
        value={data.household.address1}
        onChange={(value) => update('household', 'address1', value)}
      />
      <Field
        placeholder="Address Line 2"
        value={data.household.address2}
        onChange={(value) => update('household', 'address2', value)}
      />
      <Field
        placeholder="City"
        value={data.household.city}
        onChange={(value) => update('household', 'city', value)}
      />
      <div className="select-wrap">
        <select
          aria-label="State"
          value={data.household.state}
          onChange={(event) =>
            update('household', 'state', event.target.value)
          }
        >
          <option value="">State</option>
          {states.map(([abbreviation, name]) => (
            <option value={abbreviation} key={abbreviation}>
              {name} ({abbreviation})
            </option>
          ))}
        </select>
        <ExpandMore className="select-arrow" />
      </div>
      <Field
        placeholder="Zipcode"
        value={data.household.zip}
        onChange={(value) => update('household', 'zip', value)}
      />
      <Subheading>Home Phone Number</Subheading>
      <Field
        placeholder="Home Phone Number"
        phone
        value={data.household.phone}
        onChange={(value) => update('household', 'phone', value)}
      />
    </Shell>
  );
}

export function Contacts({
  data,
  update,
  add,
  remove,
  onNext,
  onPrevious,
}) {
  const [memberOpen, setMemberOpen] = useState(0);
  const [contactOpen, setContactOpen] = useState(0);

  const addMember = () => {
    add('members', blank.members[0]);
    setMemberOpen(data.members.length);
  };

  const addContact = () => {
    add('contacts', blank.contacts[0]);
    setContactOpen(data.contacts.length);
  };

  return (
    <Shell
      step={1}
      title="Family Members and Emergency Contacts"
      description={sectionDescriptions.contacts}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <Subheading>Family Members</Subheading>
      {data.members.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={memberOpen === index}
          onToggle={() =>
            setMemberOpen(memberOpen === index ? -1 : index)
          }
          onRemove={
            index > 0 ? () => remove('members', index) : null
          }
        >
          <ContactFields
            item={item}
            section="members"
            index={index}
            update={update}
          />
        </CollapsibleItem>
      ))}
      <AddButton onClick={addMember}>Add Another Family Member</AddButton>

      <Subheading>Other Emergency Contacts</Subheading>
      {data.contacts.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={contactOpen === index}
          onToggle={() =>
            setContactOpen(contactOpen === index ? -1 : index)
          }
          onRemove={
            index > 0 ? () => remove('contacts', index) : null
          }
        >
          <ContactFields
            item={item}
            section="contacts"
            index={index}
            update={update}
          />
        </CollapsibleItem>
      ))}
      <AddButton onClick={addContact}>
        Add Another Emergency Contact
      </AddButton>
    </Shell>
  );
}

export function Plans({ data, update, add, remove, onNext, onPrevious }) {
  const [open, setOpen] = useState(0);

  const addPlan = () => {
    add('plans', blank.plans[0]);
    setOpen(data.plans.length);
  };

  return (
    <Shell
      step={2}
      title="Emergency Plans"
      description={sectionDescriptions.plans}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      {data.plans.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={open === index}
          onToggle={() => setOpen(open === index ? -1 : index)}
          onRemove={index > 0 ? () => remove('plans', index) : null}
        >
          <Field
            placeholder="Plan Name"
            value={item.name}
            onChange={(value) => update('plans', 'name', value, index)}
          />
          <div className="nested">
            <Field
              placeholder="Address"
              value={item.address}
              onChange={(value) => update('plans', 'address', value, index)}
            />
            <Field
              placeholder="Contact Phone Number"
              phone
              value={item.phone}
              onChange={(value) => update('plans', 'phone', value, index)}
            />
            <Field
              placeholder="Other Phone Number"
              phone
              value={item.otherPhone}
              onChange={(value) =>
                update('plans', 'otherPhone', value, index)
              }
            />
            <Field
              placeholder="Website"
              value={item.website}
              onChange={(value) => update('plans', 'website', value, index)}
            />
            <Field
              placeholder="Emergency Plan Details"
              area
              value={item.details}
              onChange={(value) => update('plans', 'details', value, index)}
            />
          </div>
        </CollapsibleItem>
      ))}
      <AddButton onClick={addPlan}>Add Another Plan</AddButton>
    </Shell>
  );
}

export function Meeting({ data, update, add, remove, onNext, onPrevious }) {
  const [open, setOpen] = useState(0);

  const addMeeting = () => {
    add('meetings', blank.meetings[0]);
    setOpen(data.meetings.length);
  };

  return (
    <Shell
      step={3}
      title="Emergency Meeting Places"
      description={sectionDescriptions.meetings}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      {data.meetings.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={open === index}
          onToggle={() => setOpen(open === index ? -1 : index)}
          onRemove={index > 0 ? () => remove('meetings', index) : null}
        >
          <Field
            placeholder="Location Name"
            value={item.name}
            onChange={(value) => update('meetings', 'name', value, index)}
          />
          <div className="nested">
            <Field
              placeholder="Address"
              value={item.address}
              onChange={(value) => update('meetings', 'address', value, index)}
            />
            <Field
              placeholder="Instructions/Scenario"
              area
              value={item.instructions}
              onChange={(value) =>
                update('meetings', 'instructions', value, index)
              }
            />
          </div>
        </CollapsibleItem>
      ))}
      <AddButton onClick={addMeeting}>
        Add Another Emergency Meeting Place
      </AddButton>
    </Shell>
  );
}

export function Medical({ data, update, add, remove, onNext, onPrevious }) {
  const [doctorOpen, setDoctorOpen] = useState(0);
  const [allergyOpen, setAllergyOpen] = useState(0);
  const [insuranceOpen, setInsuranceOpen] = useState(0);

  const addDoctor = () => {
    add('doctors', blank.doctors[0]);
    setDoctorOpen(data.doctors.length);
  };

  const addAllergy = () => {
    add('allergies', blank.allergies[0]);
    setAllergyOpen(data.allergies.length);
  };

  const addInsurance = () => {
    add('insurance', blank.insurance[0]);
    setInsuranceOpen(data.insurance.length);
  };

  return (
    <Shell
      step={4}
      title="Medical Information"
      description={sectionDescriptions.medical}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <Subheading>Doctors</Subheading>
      {data.doctors.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={doctorOpen === index}
          onToggle={() =>
            setDoctorOpen(doctorOpen === index ? -1 : index)
          }
          onRemove={index > 0 ? () => remove('doctors', index) : null}
        >
          <Field
            placeholder="Doctor Type"
            value={item.type}
            onChange={(value) => update('doctors', 'type', value, index)}
          />
          <div className="nested">
            <Field
              placeholder="Doctor Name"
              value={item.name}
              onChange={(value) => update('doctors', 'name', value, index)}
            />
            <Field
              placeholder="Phone Number"
              phone
              value={item.phone}
              onChange={(value) => update('doctors', 'phone', value, index)}
            />
            <Field
              placeholder="Address"
              value={item.address}
              onChange={(value) => update('doctors', 'address', value, index)}
            />
          </div>
        </CollapsibleItem>
      ))}
      <AddButton onClick={addDoctor}>Add Another Doctor</AddButton>

      <Subheading>Allergy Information and Prescriptions</Subheading>
      {data.allergies.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={allergyOpen === index}
          onToggle={() =>
            setAllergyOpen(allergyOpen === index ? -1 : index)
          }
          onRemove={index > 0 ? () => remove('allergies', index) : null}
        >
          <Field
            placeholder="Family Member Name"
            value={item.member}
            onChange={(value) => update('allergies', 'member', value, index)}
          />
          <div className="nested">
            <Field
              placeholder="Allergies"
              area
              value={item.allergies}
              onChange={(value) =>
                update('allergies', 'allergies', value, index)
              }
            />
            <Field
              placeholder="Prescriptions"
              area
              value={item.prescriptions}
              onChange={(value) =>
                update('allergies', 'prescriptions', value, index)
              }
            />
          </div>
        </CollapsibleItem>
      ))}
      <AddButton onClick={addAllergy}>Add Another Allergy Record</AddButton>

      <Subheading>Insurance Information</Subheading>
      {data.insurance.map((item, index) => (
        <CollapsibleItem
          key={index}
          open={insuranceOpen === index}
          onToggle={() =>
            setInsuranceOpen(insuranceOpen === index ? -1 : index)
          }
          onRemove={index > 0 ? () => remove('insurance', index) : null}
        >
          <Field
            placeholder="Medical Insurance Name"
            value={item.name}
            onChange={(value) => update('insurance', 'name', value, index)}
          />
          <div className="nested">
            <Field
              placeholder="Medical Insurance Policy Number"
              value={item.policy}
              onChange={(value) => update('insurance', 'policy', value, index)}
            />
            <Field
              placeholder="Notes"
              area
              value={item.notes}
              onChange={(value) => update('insurance', 'notes', value, index)}
            />
          </div>
        </CollapsibleItem>
      ))}
      <AddButton onClick={addInsurance}>Add Another Insurance</AddButton>

      <Subheading>Assistive Devices and Medical Equipment</Subheading>
      <Field
        placeholder="Notes (make, model, supplier, and serial number)"
        area
        value={data.equipment}
        onChange={(value) => update('medical', 'equipment', value)}
      />
    </Shell>
  );
}

export function Review({ data, onNext, onPrevious, onEdit }) {
  const sections = [
    ['Household Information', data.household, 0],
    ['Family Members', data.members, 1],
    ['Emergency Contacts', data.contacts, 1],
    ['Emergency Plans', data.plans, 2],
    ['Meeting Places', data.meetings, 3],
    ['Doctors', data.doctors, 4],
    ['Allergies and Prescriptions', data.allergies, 4],
    ['Insurance', data.insurance, 4],
    [
      'Assistive Devices and Medical Equipment',
      { equipment: data.equipment },
      4,
    ],
  ];

  return (
    <Shell
      step={5}
      title="Review your Plan"
      description={sectionDescriptions.review}
      onNext={onNext}
      onPrevious={onPrevious}
      nextLabel="Finish"
    >
      <p className="review-intro">
        Review every answer before finishing. Blank fields are shown so you can
        easily return to the section that needs more information.
      </p>
      {sections.map(([title, values, editStep]) => (
        <ReviewGroup
          key={title}
          title={title}
          values={values}
          onEdit={() => onEdit(editStep)}
        />
      ))}
    </Shell>
  );
}

function ReviewGroup({ title, values, onEdit }) {
  const records = Array.isArray(values) ? values : [values];

  return (
    <div className="review-group">
      <div className="review-heading">
        <h3>{title}</h3>
        <button type="button" className="edit-button" onClick={onEdit}>
          Edit section
        </button>
      </div>
      {records.map((record, index) => (
        <div className="review-record" key={index}>
          <span className="record-label">
            {records.length > 1
              ? `${title.replace(/s$/, '')} ${index + 1}`
              : ''}
          </span>
          {Object.entries(record).map(([field, value]) => (
            <div className="review-field" key={field}>
              <span>{field.replace(/([A-Z])/g, ' $1')}</span>
              <strong className={value ? '' : 'blank-value'}>
                {value || 'Blank'}
              </strong>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
