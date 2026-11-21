import React, { useEffect, useState } from 'react';
import {
  Card as MuiCard,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  PictureAsPdf,
  Share,
  WorkspacePremium,
} from '@mui/icons-material';
import { Button } from './common';
import {
  createCertificatePdf,
  downloadCertificate,
  downloadPlan,
} from '../utils/pdf';

export function Certificate({ data }) {
  const firstFamilyMemberName =
    data.members.find((member) => member.name)?.name || '';
  const nameParts = firstFamilyMemberName.trim().split(/\s+/);
  const lastName = nameParts.at(-1) || '';
  const householdName = lastName ? `${lastName} Household` : '';
  const [recipientName, setRecipientName] = useState(
    householdName,
  );
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');

  const shareText =
    'I completed my Emergency Communication Plan with Ready.gov! Build yours and download the plan and certificate for your household: https://idmt380-gamification-ojk25.vercel.app';

  useEffect(() => {
    if (!recipientName.trim()) {
      setCertificateUrl('');
      return undefined;
    }

    let activeUrl = '';
    let active = true;
    createCertificatePdf(recipientName)
      .then((blob) => {
        if (!active) return;
        activeUrl = URL.createObjectURL(blob);
        setCertificateUrl(activeUrl);
      })
      .catch(() => {
        if (active) setCertificateUrl('');
      });

    return () => {
      active = false;
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [recipientName]);

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      const copyField = document.createElement('textarea');
      copyField.value = shareText;
      document.body.appendChild(copyField);
      copyField.select();
      document.execCommand('copy');
      copyField.remove();
    }
    setCopied(true);
  };

  return (
    <MuiCard component="section" className="card certificate">
      <h2>Your Household is Ready</h2>
      <p className="description">
        You completed your Family Emergency Communication Plan. Keep a copy
        with your emergency supplies and share it with the people who may need
        it.
      </p>
      <input
        className="certificate-name-field"
        aria-label="Name for certificate"
        placeholder="Name for certificate"
        value={recipientName}
        onChange={(event) => setRecipientName(event.target.value)}
        required
      />
      <div className="certificate-preview">
        {recipientName.trim() && certificateUrl ? (
          <iframe
            title="Preparedness certificate preview"
            src={`${certificateUrl}#toolbar=0&navpanes=0&view=FitH`}
          />
        ) : (
          <p>Enter a name to preview and download your certificate.</p>
        )}
      </div>
      <div className="certificate-buttons">
        <Button
          onClick={() => downloadPlan(data)}
          icon={<PictureAsPdf />}
        >
          Download my PDF Plan
        </Button>
        <Button
          onClick={() => downloadCertificate(recipientName)}
          icon={<WorkspacePremium />}
          disabled={!recipientName.trim()}
        >
          Download my Certificate
        </Button>
        <Button onClick={() => setShareOpen(true)} icon={<Share />}>
          Share this Form
        </Button>
      </div>

      <Dialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Share Ready Set Plan</DialogTitle>
        <DialogContent>
          <textarea
            className="share-text"
            value={shareText}
            readOnly
            rows={4}
            onFocus={(event) => event.target.select()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={copyShareText}>
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
        </DialogActions>
      </Dialog>
    </MuiCard>
  );
}
