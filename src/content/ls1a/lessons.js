// "Help me understand" lessons for LS 1A — same six-step sequence as Math MA.
// Prepared content, not AI-generated. Append new lessons with the same shape.

export const lsLessons = [
  {
    id: 'll-pka',
    category: 'chem',
    title: 'pH, pKa, and charge',
    explain: [
      'Many biological groups can gain or lose a proton (H⁺). Whether a group is protonated depends on how the pH compares with its `pK_{a}`.',
      'Rule of thumb: when **pH < pKa**, protons are plentiful and the group stays **protonated**. When **pH > pKa**, the group gives up its proton and is **deprotonated**. At pH = pKa, it is 50/50.',
    ],
    example: {
      problem: 'An amino group (–NH₃⁺ ⇌ –NH₂ + H⁺) has `pK_{a} ≈ 9`. At pH 7.4, is it mostly charged?',
      answer: 'Yes. pH 7.4 < 9, so the protonated form –NH₃⁺ (positively charged) predominates.',
      figure: 'protonation',
    },
    steps: [
      { do: 'Write both forms: –NH₃⁺ (protonated, +1) and –NH₂ (deprotonated, neutral).', why: 'Identifying which form carries a charge is half the problem.' },
      { do: 'Compare: pH 7.4 is below pKa 9.', why: 'Lower pH means higher [H⁺], which favors the protonated form.' },
      { do: 'Conclude: mostly –NH₃⁺, so the group is positively charged.', why: 'For carboxyl groups, the protonated form is neutral and the deprotonated form is negative, so always check which form carries the charge.' },
    ],
    hint: 'First compare pH with pKa to choose protonated vs. deprotonated. Then ask which of those two forms carries a charge.',
    question: {
      id: 'll-pka-q', type: 'mc',
      prompt: 'A side-chain carboxyl group has `pK_{a} ≈ 4`. At pH 7.4, which form predominates?',
      choices: [
        { text: '–COO⁻ (deprotonated, negatively charged)', correct: true, why: 'pH 7.4 > pKa 4, so the group loses its proton. ✓' },
        { text: '–COOH (protonated, neutral)', why: 'That form predominates only when pH is below about 4.' },
        { text: 'Equal amounts of each', why: 'That happens only at pH = pKa.' },
        { text: '–COOH₂⁺ (positively charged)', why: 'This form isn’t significant under physiological conditions.' },
      ],
    },
  },
  {
    id: 'll-inhibition',
    category: 'experiments',
    title: 'Reading an enzyme-inhibition experiment',
    explain: [
      'Enzyme experiments often measure reaction **rate** as **substrate concentration** increases. Rate rises and then levels off (the enzyme is saturated).',
      'Adding an inhibitor changes the curve’s shape in telling ways. If extra substrate can overcome the inhibitor, the inhibitor is probably competing for the active site.',
    ],
    example: {
      problem: 'With inhibitor Y, the rate is lower at every substrate concentration, and even at very high substrate the plateau stays at about half the uninhibited plateau. Is Y competitive?',
      answer: 'Unlikely. Extra substrate doesn’t rescue activity, so Y is not simply competing for the active site. It might bind elsewhere or inactivate the enzyme.',
    },
    steps: [
      { do: 'Describe the pattern: lower rates overall; the plateau (maximum rate) is reduced.', why: 'Always describe the data before explaining it.' },
      { do: 'Ask: does high substrate restore normal rates?', why: 'This is the key test for competition.' },
      { do: 'No: the plateau stays lower. So Y is not purely competitive.', why: 'A competitive inhibitor would be outcompeted at high substrate.' },
    ],
    hint: 'Look at the highest substrate concentration. Do the two conditions converge?',
    question: {
      id: 'll-inhibition-q', type: 'mc',
      prompt: 'With compound Z, rates are much lower at low substrate but almost identical to the control at very high substrate. The most reasonable conclusion is:',
      figure: 'inhibition',
      choices: [
        { text: 'Z is likely a competitive inhibitor that binds the active site.', correct: true, why: 'High substrate outcompetes Z, so the maximum rate is unchanged. ✓' },
        { text: 'Z permanently inactivates the enzyme.', why: 'Then high substrate couldn’t restore the control rate.' },
        { text: 'Z increases the enzyme’s maximum rate.', why: 'The maximum rates are about the same.' },
        { text: 'Z has no effect on the enzyme.', why: 'Rates are clearly lower at low substrate.' },
      ],
    },
  },
  {
    id: 'll-mutation',
    category: 'structure',
    title: 'From one mutation to a changed protein',
    explain: [
      'A DNA change matters for a protein only if it changes the amino-acid sequence, and only a lot if that change affects **folding** or **binding**.',
      'To predict an effect, follow the chain: DNA codon → amino acid → side-chain chemistry → where it sits in the protein → consequence.',
    ],
    example: {
      problem: 'A mutation replaces a lysine (positively charged) with a glutamate (negatively charged) at a DNA-binding surface of a protein. Predict the effect on DNA binding.',
      answer: 'Binding likely weakens: a positive charge that attracted the negative DNA backbone is replaced by a negative charge that repels it.',
    },
    steps: [
      { do: 'Identify the chemistry change: +1 charge becomes −1 charge.', why: 'Side-chain properties determine interactions.' },
      { do: 'Locate it: a surface that contacts DNA.', why: 'The same change buried elsewhere could matter less.' },
      { do: 'Reason about interactions: DNA’s phosphate backbone is negative.', why: 'Opposite charges attract; like charges repel.' },
    ],
    hint: 'Ask what kind of side chain was lost, what replaced it, and what that part of the protein normally touches.',
    question: {
      id: 'll-mutation-q', type: 'mc',
      prompt: 'In the folded core of a soluble enzyme, a leucine (nonpolar) is replaced by an aspartate (negatively charged). What is the most likely consequence?',
      choices: [
        { text: 'The enzyme may fold less stably, because a charged group is now buried in the nonpolar interior.', correct: true, why: 'Burying a charge away from water is unfavorable; the core’s hydrophobic packing is disrupted. ✓' },
        { text: 'No effect, because only surface residues matter.', why: 'Core residues are crucial for stable folding.' },
        { text: 'The enzyme’s primary structure is unchanged.', why: 'A different amino acid *is* a change in primary structure.' },
        { text: 'The enzyme will bind more DNA.', why: 'Nothing here involves DNA binding. And a negative charge would, if anything, repel DNA.' },
      ],
    },
  },
]
