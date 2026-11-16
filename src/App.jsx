import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import {
  Cover,
  Header,
} from './components/common';
import {
  Contacts,
  Household,
  Medical,
  Meeting,
  Plans,
  Review,
} from './components/sections';
import { Certificate } from './components/Certificate';
import { STORAGE_KEY, loadData, steps } from './data';

export default function App() {
  const [data, setData] = useState(loadData);
  const [screen, setScreen] = useState(-1);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = (section, field, value, index) => {
    setData((old) => {
      if (section === 'medical' && field === 'equipment') {
        return { ...old, equipment: value };
      }

      if (typeof index === 'number') {
        const list = [...old[section]];
        list[index] = { ...list[index], [field]: value };
        return { ...old, [section]: list };
      }

      return {
        ...old,
        [section]: { ...old[section], [field]: value },
      };
    });
  };

  const add = (section, shape) => {
    setData((old) => ({
      ...old,
      [section]: [...old[section], shape],
    }));
  };

  const remove = (section, index) => {
    setData((old) => ({
      ...old,
      [section]: old[section].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const completePlan = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  const next = () => {
    setScreen((current) => Math.min(steps.length - 1, current + 1));
  };

  const previous = () => {
    setScreen((current) => Math.max(0, current - 1));
  };

  let content;

  if (screen === -1) {
    content = <Cover onStart={next} />;
  } else if (screen === 0) {
    content = (
      <Household
        data={data}
        update={update}
        onNext={next}
        onPrevious={() => setScreen(-1)}
      />
    );
  } else if (screen === 1) {
    content = (
      <Contacts
        data={data}
        update={update}
        add={add}
        remove={remove}
        onNext={next}
        onPrevious={previous}
      />
    );
  } else if (screen === 2) {
    content = (
      <Plans
        data={data}
        update={update}
        add={add}
        remove={remove}
        onNext={next}
        onPrevious={previous}
      />
    );
  } else if (screen === 3) {
    content = (
      <Meeting
        data={data}
        update={update}
        add={add}
        remove={remove}
        onNext={next}
        onPrevious={previous}
      />
    );
  } else if (screen === 4) {
    content = (
      <Medical
        data={data}
        update={update}
        add={add}
        remove={remove}
        onNext={next}
        onPrevious={previous}
      />
    );
  } else if (submitted) {
    content = <Certificate data={data} />;
  } else {
    content = (
      <Review
        data={data}
        onNext={completePlan}
        onPrevious={previous}
        onEdit={setScreen}
      />
    );
  }

  return (
    <Container component="main" className="page" maxWidth={false}>
      <Header />
      {content}
    </Container>
  );
}
