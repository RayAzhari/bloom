// LS 1A practice questions: original, reasoning-focused.
// `skill` is one of: vocab | structure-function | cause-effect | experiment | apply
// Each multiple-choice option explains why it is right or wrong.

export const SKILL_LABEL = {
  vocab: 'Concepts & vocabulary',
  'structure-function': 'Structure → function',
  'cause-effect': 'Cause & effect',
  experiment: 'Interpreting experiments',
  apply: 'Apply to a new scenario',
}

export const lsPractice = [
  {
    id: 'ls-p1', category: 'biomolecules', skill: 'vocab', level: 'intro', type: 'mc',
    prompt: 'Which interaction holds the **two strands** of a DNA double helix together, base to base?',
    choices: [
      { text: 'Hydrogen bonds between complementary bases', correct: true, why: 'A–T pairs share 2 hydrogen bonds and G–C pairs share 3. (Base stacking also stabilizes the helix.) ✓' },
      { text: 'Phosphodiester bonds', why: 'These covalent bonds link nucleotides *within* one strand, forming the backbone.' },
      { text: 'Ionic bonds between phosphate groups', why: 'Phosphates are all negatively charged, so they repel each other.' },
      { text: 'Peptide bonds', why: 'Peptide bonds link amino acids in proteins.' },
    ],
    hints: ['Strands separate when DNA is heated. That suggests noncovalent interactions.', 'Which interaction depends on specific base pairs (A with T, G with C)?'],
  },
  {
    id: 'ls-p2', category: 'structure', skill: 'structure-function', level: 'core', type: 'mc',
    prompt: 'In sickle-cell hemoglobin, a glutamate on the protein’s **surface** is replaced by valine. Why does this make deoxygenated hemoglobin molecules stick together?',
    choices: [
      { text: 'A charged, water-loving side chain becomes nonpolar, creating a hydrophobic patch that binds a complementary nonpolar region on another hemoglobin.', correct: true, why: 'Glutamate is negatively charged; valine is nonpolar. A nonpolar surface patch favors association with other nonpolar surfaces (hydrophobic effect). ✓' },
      { text: 'Valine forms covalent disulfide bonds between hemoglobin molecules.', why: 'Disulfide bonds form between cysteine side chains, not valine.' },
      { text: 'The substitution breaks the protein’s peptide backbone.', why: 'A substitution changes one side chain; the backbone remains intact.' },
      { text: 'Valine carries a positive charge that attracts negative charges on neighboring proteins.', why: 'Valine’s side chain is nonpolar and uncharged.' },
    ],
    hints: ['Compare the side chains: glutamate is acidic (charged); valine is…?', 'What does water do to exposed nonpolar surfaces?'],
  },
  {
    id: 'ls-p3', category: 'chem', skill: 'cause-effect', level: 'core', type: 'mc',
    prompt: 'A drug has a carboxylic acid group with `pK_{a} ≈ 4`. In which environment is that group **mostly uncharged**?',
    choices: [
      { text: 'Stomach (pH ≈ 2)', correct: true, why: 'pH is below pKa, so the protonated, neutral –COOH form predominates. ✓' },
      { text: 'Blood (pH ≈ 7.4)', why: 'pH is above pKa, so the group is mostly deprotonated (–COO⁻, charged).' },
      { text: 'Equally charged in both', why: 'Protonation depends on pH relative to pKa, and the two pH values differ.' },
      { text: 'Neither: carboxylic acids are always charged', why: 'At pH well below the pKa, the group is mostly protonated and neutral.' },
    ],
    hints: ['Compare each pH to the pKa.', 'pH < pKa means protonated form predominates. Is –COOH charged?'],
  },
  {
    id: 'ls-p4', category: 'biomolecules', skill: 'cause-effect', level: 'intro', type: 'mc',
    prompt: 'Why do phospholipids **spontaneously** form bilayers when placed in water?',
    choices: [
      { text: 'Hiding the nonpolar tails from water reduces the ordering of water molecules, increasing entropy.', correct: true, why: 'This is the hydrophobic effect. No energy input is needed. ✓' },
      { text: 'The tails form covalent bonds with each other.', why: 'Bilayers are held together by noncovalent interactions, which is why membranes are fluid.' },
      { text: 'The nonpolar tails are strongly attracted to water.', why: 'Nonpolar tails don’t hydrogen-bond with water; that is why they hide.' },
      { text: 'Cells use ATP to arrange the lipids.', why: 'Bilayers form spontaneously even in a test tube without ATP.' },
    ],
    hints: ['Phospholipids are amphipathic. Which part faces water?', 'Think about what the water molecules gain.'],
  },
  {
    id: 'ls-p5', category: 'experiments', skill: 'experiment', level: 'challenge', type: 'mc',
    prompt: 'An enzyme’s reaction rate is measured at increasing substrate concentrations, with and without compound X (illustrative data below). What is the most likely way X works?',
    figure: 'inhibition',
    table: { rows: [['[substrate] (mM)', 1, 5, 20, 100], ['rate, no X', 50, 83, 95, 99], ['rate, with X', 25, 63, 87, 97]] },
    choices: [
      { text: 'X competes with the substrate for the active site.', correct: true, why: 'X lowers the rate most at low substrate, but at high substrate the rates converge. Substrate outcompetes X, which is the signature of competitive inhibition. ✓' },
      { text: 'X irreversibly destroys the enzyme.', why: 'Then the maximum rate would stay lower even at high substrate.' },
      { text: 'X binds elsewhere and lowers the maximum rate.', why: 'That would reduce the plateau, but the plateaus here are nearly equal.' },
      { text: 'X increases the enzyme’s activity.', why: 'Every rate with X is lower or equal.' },
    ],
    hints: ['Compare the two rows at low substrate, then at high substrate.', 'If adding lots of substrate erases the effect, what are X and the substrate competing for?'],
  },
  {
    id: 'ls-p6', category: 'experiments', skill: 'experiment', level: 'challenge', type: 'mc',
    prompt: 'Bacteria are grown for many generations in heavy nitrogen (¹⁵N), then moved to light nitrogen (¹⁴N). After **two** rounds of replication, DNA is separated by density. If replication is semi-conservative, what do you expect?',
    choices: [
      { text: 'One intermediate (hybrid) band and one light band, in equal amounts', correct: true, why: 'Round 1 gives all ¹⁵N/¹⁴N hybrids. In round 2, each hybrid makes one hybrid and one fully light molecule. ✓' },
      { text: 'One heavy band and one light band', why: 'That is the conservative model’s prediction (original double helix stays intact).' },
      { text: 'A single intermediate band', why: 'That is the result after *one* round. The second round produces fully light DNA too.' },
      { text: 'A single light band', why: 'The original heavy strands are never lost; they remain in hybrid molecules.' },
    ],
    hints: ['Draw the parent helix as two heavy strands. After round 1, what is each daughter made of?', 'In round 2, each strand of a hybrid templates a new light strand.'],
  },
  {
    id: 'ls-p7', category: 'molbio', skill: 'apply', level: 'challenge', type: 'mc',
    prompt: 'The antiviral drug AZT resembles thymidine but has an azido group (–N₃) where the **3′-OH** normally is. Reverse transcriptase incorporates it into a growing DNA strand. What happens next?',
    choices: [
      { text: 'Synthesis stops, because no next nucleotide can be attached without a 3′-OH.', correct: true, why: 'Polymerases form each new phosphodiester bond using the 3′-OH of the last nucleotide, so AZT acts as a chain terminator. ✓' },
      { text: 'The strand continues but pairs incorrectly.', why: 'The issue isn’t pairing; there is no 3′-OH for the next bond.' },
      { text: 'Synthesis continues from the 5′ end instead.', why: 'Polymerases only extend 3′ ends.' },
      { text: 'The ribosome can no longer translate viral proteins.', why: 'AZT acts on DNA synthesis by reverse transcriptase, not on translation.' },
    ],
    hints: ['Which end of a growing strand do polymerases add to?', 'What chemical group does that addition require?'],
  },
  {
    id: 'ls-p8', category: 'chem', skill: 'vocab', level: 'core', type: 'mc',
    prompt: 'An enzyme speeds up a reaction whose `ΔG = −20` kJ/mol. What does the enzyme change?',
    choices: [
      { text: 'It lowers the activation energy, so the reaction reaches equilibrium faster. ΔG stays −20 kJ/mol.', correct: true, why: 'Catalysts change rates, not the free-energy difference between reactants and products. ✓' },
      { text: 'It makes ΔG more negative.', why: 'ΔG depends on the reactants, products, and conditions, not on the catalyst.' },
      { text: 'It shifts the equilibrium toward products.', why: 'A catalyst speeds forward and reverse reactions equally; the equilibrium position is unchanged.' },
      { text: 'It supplies energy to drive the reaction.', why: 'The reaction is already spontaneous; enzymes aren’t energy sources.' },
    ],
    hints: ['Separate “whether” (thermodynamics) from “how fast” (kinetics).'],
  },
  {
    id: 'ls-p9', category: 'molbio', skill: 'apply', level: 'core', type: 'mc',
    prompt: 'A point mutation changes an mRNA codon from **UAC** (tyrosine) to **UAA**. What kind of mutation is this, and what is the likely result?',
    choices: [
      { text: 'Nonsense: UAA is a stop codon, so translation ends early and the protein is truncated.', correct: true, why: 'UAA, UAG, and UGA are the stop codons. ✓' },
      { text: 'Silent: the amino acid is unchanged.', why: 'UAA doesn’t code for tyrosine (or any amino acid).' },
      { text: 'Missense: tyrosine is replaced by another amino acid.', why: 'A missense change gives a different amino acid, but UAA is a stop signal.' },
      { text: 'Frameshift: all later codons are read in a new frame.', why: 'Frameshifts come from insertions or deletions; this is a single substitution.' },
    ],
    hints: ['Recall the three stop codons.'],
  },
  {
    id: 'ls-p10', category: 'experiments', skill: 'experiment', level: 'intro', type: 'mc',
    prompt: 'A student tests whether a new compound kills bacteria. The compound is dissolved in ethanol before being added. Which control is **most essential** for interpreting the result?',
    choices: [
      { text: 'Bacteria treated with the same amount of ethanol alone', correct: true, why: 'This vehicle control shows whether any killing is due to the solvent rather than the compound. ✓' },
      { text: 'Bacteria treated with twice as much compound', why: 'Useful for a dose–response curve, but it doesn’t separate the compound from the ethanol.' },
      { text: 'A different species of bacteria with the compound', why: 'This changes another variable and doesn’t address the solvent.' },
      { text: 'No control is needed if the bacteria die', why: 'Without controls, you can’t attribute the effect to the compound.' },
    ],
    hints: ['What else, besides the compound, was added to the bacteria?'],
  },
  {
    id: 'ls-p11', category: 'structure', skill: 'cause-effect', level: 'core', type: 'mc',
    prompt: 'A protein binds DNA using positively charged lysine and arginine side chains that contact the DNA backbone. Raising the salt concentration greatly **weakens** binding. Why?',
    choices: [
      { text: 'Salt ions screen the opposite charges, weakening the ionic interactions between protein and DNA.', correct: true, why: 'The backbone is negatively charged (phosphates); dissolved ions shield both partners. ✓' },
      { text: 'Salt breaks the covalent bonds in the DNA backbone.', why: 'Salt doesn’t break phosphodiester bonds.' },
      { text: 'Salt hydrolyzes the protein’s peptide bonds.', why: 'Hydrolysis of peptide bonds needs enzymes or harsh conditions, not just salt.' },
      { text: 'Salt makes the DNA backbone positively charged.', why: 'Phosphates remain negatively charged; their charge is just partially shielded.' },
    ],
    hints: ['What is the charge on the DNA backbone?', 'What type of interaction is sensitive to surrounding ions?'],
  },
  {
    id: 'ls-p12', category: 'structure', skill: 'experiment', level: 'core', type: 'mc',
    prompt: 'An enzyme’s activity is measured at different temperatures (data below). What best explains the sharp drop above 40 °C?',
    table: { rows: [['Temperature (°C)', 20, 30, 37, 45, 55], ['Relative activity', 0.35, 0.65, 1.0, 0.4, 0.05]] },
    choices: [
      { text: 'Heat disrupts the noncovalent interactions that hold the enzyme’s 3D shape, so it denatures.', correct: true, why: 'Below the optimum, rates rise with temperature (molecules move faster). Above it, loss of folded structure dominates. ✓' },
      { text: 'Higher temperature makes ΔG positive.', why: 'The drop reflects the enzyme losing its structure, not a change in the reaction’s spontaneity.' },
      { text: 'Heat breaks the peptide bonds, shortening the enzyme.', why: 'Moderate heat unfolds proteins without breaking their covalent backbone.' },
      { text: 'Substrate molecules move too slowly at high temperature.', why: 'Molecules move faster as temperature rises.' },
    ],
    hints: ['Why does activity first go up? What changes at the higher temperatures?'],
  },
]
