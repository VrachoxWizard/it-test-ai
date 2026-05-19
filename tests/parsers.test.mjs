import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractTicketTitle,
  extractDebrief,
  stripDebriefFromDisplay,
  extractNextStep,
  isTicketResolved,
} from '../public/js/parsers.js';

test('extractTicketTitle finds Subject line', () => {
  const t = extractTicketTitle('Subject: CEO locked out of laptop\nDetails...');
  assert.equal(t, 'CEO locked out of laptop');
});

test('extractDebrief parses block', () => {
  const text = `Good work.
---DEBRIEF---
Skill: AD lookup
Command: Get-ADUser -Identity jsmith
Remember: Always verify username spelling
---END---`;
  const d = extractDebrief(text);
  assert.equal(d.skill, 'AD lookup');
  assert.equal(d.command, 'Get-ADUser -Identity jsmith');
  assert.ok(d.remember.includes('username'));
});

test('stripDebriefFromDisplay removes block', () => {
  const out = stripDebriefFromDisplay('Hello\n---DEBRIEF---\nSkill: x\n---END---');
  assert.ok(!out.includes('DEBRIEF'));
});

test('extractNextStep finds cmdlet', () => {
  const s = extractNextStep('Try running Get-ADUser next.');
  assert.ok(s.includes('Get-ADUser'));
});

test('isTicketResolved requires verdict and debrief', () => {
  assert.equal(isTicketResolved('Verdict: CORRECT\n---DEBRIEF---\nSkill: a\n---END---'), true);
  assert.equal(isTicketResolved('Verdict: CORRECT only'), false);
});
