import React from 'react';
import { Card as MuiCard } from '@mui/material';
import {
  PictureAsPdf,
  Share,
  WorkspacePremium,
} from '@mui/icons-material';
import { Button } from './common';
import { downloadCertificate, downloadPlan } from '../utils/pdf';

export function Certificate({ data }) {
  const householdName =
    data.members.find((member) => member.name)?.name ||
    data.household.city ||
    'Your household';

  return (
    <MuiCard component="section" className="card certificate">
      <h2>Your Household is Ready</h2>
      <p className="description">
        You completed your Family Emergency Communication Plan. Keep a copy
        with your emergency supplies and share it with the people who may need
        it.
      </p>
      <div className="certificate-art">
        <span>Certificate</span>
        <strong>
          This certifies that
          <br />
          {householdName}
        </strong>
        <small>is prepared with a family emergency communication plan</small>
      </div>
      <div className="certificate-buttons">
        <Button
          onClick={() => downloadPlan(data)}
          icon={<PictureAsPdf />}
        >
          Download my PDF Plan
        </Button>
        <Button
          onClick={() => downloadCertificate(data)}
          icon={<WorkspacePremium />}
        >
          Download my Certificate
        </Button>
        <Button
          onClick={() =>
            navigator.clipboard?.writeText(
              'My household emergency plan is ready!',
            )
          }
          icon={<Share />}
        >
          Share this Form
        </Button>
      </div>
    </MuiCard>
  );
}
