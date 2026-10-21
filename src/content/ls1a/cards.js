// LS 1A flashcards. `category` matches an id in concepts.js.
// Keep backs short enough to read in one breath. Explanations live in the concept guides.

export const lsCards = [
  // Chemistry
  { id: 'fc-electroneg', category: 'chem', front: 'What is electronegativity, and why are O–H bonds polar?', back: 'An atom’s pull on shared electrons. Oxygen is far more electronegative than hydrogen, so O carries a partial negative charge (δ−) and H a partial positive charge (δ+).' },
  { id: 'fc-hbond', category: 'chem', front: 'What is a hydrogen bond?', back: 'A noncovalent attraction between an H attached to O or N and a lone pair on another O or N. Weak alone, strong in large numbers (water, DNA base pairs, protein secondary structure).' },
  { id: 'fc-hydrophobic', category: 'chem', front: 'What drives the hydrophobic effect?', back: 'Mostly entropy. Clustering nonpolar groups frees water molecules that would otherwise be held in ordered cages around them.' },
  { id: 'fc-pka', category: 'chem', front: 'pH is below a group’s pKa. Which form predominates?', back: 'The protonated form. (pH = pKa means 50/50; pH above pKa means the deprotonated form predominates.)' },
  { id: 'fc-dg', category: 'chem', front: 'What does ΔG < 0 tell you, and what doesn’t it tell you?', back: 'The process is spontaneous (exergonic). It does not tell you how fast it happens. Rate depends on activation energy.' },
  { id: 'fc-ionic-salt', category: 'chem', front: 'Why does high salt weaken ionic interactions between molecules?', back: 'Dissolved ions cluster around charged groups and screen them, reducing the attraction between opposite charges.' },

  // Structure → function
  { id: 'fc-levels', category: 'structure', front: 'Name the four levels of protein structure.', back: 'Primary: sequence. Secondary: α-helices and β-sheets (backbone H-bonds). Tertiary: full 3D fold of one chain. Quaternary: multiple chains assembled.' },
  { id: 'fc-core', category: 'structure', front: 'Where are nonpolar side chains usually found in a soluble protein, and why?', back: 'Buried in the interior. The hydrophobic effect favors hiding nonpolar groups from water; polar and charged side chains tend to face outward.' },
  { id: 'fc-active-site', category: 'structure', front: 'What does an enzyme’s active site do?', back: 'Binds the substrate with complementary shape and chemistry, and positions groups that stabilize the transition state, lowering activation energy.' },
  { id: 'fc-competitive', category: 'structure', front: 'How does a competitive inhibitor behave at very high substrate concentration?', back: 'Its effect is overcome. Substrate outcompetes it for the active site, so the maximum rate (Vmax) is unchanged; more substrate is needed to reach half-max.' },
  { id: 'fc-denature', category: 'structure', front: 'What happens when a protein denatures?', back: 'It loses its 3D structure (and usually its function) as noncovalent interactions are disrupted, e.g. by heat or extreme pH. The amino-acid sequence stays intact.' },

  // Biomolecules
  { id: 'fc-condense', category: 'biomolecules', front: 'Condensation vs. hydrolysis?', back: 'Condensation (dehydration) joins monomers and releases water. Hydrolysis breaks the bond by adding water.' },
  { id: 'fc-phosphodiester', category: 'biomolecules', front: 'How are nucleotides linked in a strand?', back: 'Phosphodiester bonds connect the 3′ carbon of one sugar to the 5′ phosphate of the next. This gives the strand 5′ and 3′ ends and a negatively charged backbone.' },
  { id: 'fc-pairing', category: 'biomolecules', front: 'Base-pairing rules and hydrogen bonds?', back: 'A–T (A–U in RNA) with 2 hydrogen bonds; G–C with 3. The two DNA strands are antiparallel.' },
  { id: 'fc-dna-rna', category: 'biomolecules', front: 'Two chemical differences between DNA and RNA?', back: 'RNA’s ribose has a 2′-OH that DNA’s deoxyribose lacks; RNA uses uracil where DNA uses thymine. (DNA is also usually double-stranded.)' },
  { id: 'fc-amphipathic', category: 'biomolecules', front: 'Why do phospholipids form bilayers in water?', back: 'They are amphipathic. Polar heads face water and nonpolar tails hide inside, driven by the hydrophobic effect.' },

  // Molecular biology
  { id: 'fc-dogma', category: 'molbio', front: 'State the central dogma, and the retrovirus exception.', back: 'DNA → RNA (transcription) → protein (translation). Retroviruses copy their RNA genome into DNA with reverse transcriptase.' },
  { id: 'fc-direction', category: 'molbio', front: 'In which direction are new DNA and RNA strands synthesized?', back: '5′ → 3′. Polymerases add each new nucleotide to the free 3′-OH of the growing strand.' },
  { id: 'fc-semicons', category: 'molbio', front: 'What does “semi-conservative replication” mean?', back: 'Each daughter double helix contains one original (parental) strand and one newly made strand.' },
  { id: 'fc-codons', category: 'molbio', front: 'How many codons are there, and what do they encode?', back: '64 codons: 61 specify amino acids, 3 are stop codons. AUG codes for methionine and is the usual start codon.' },
  { id: 'fc-mutations', category: 'molbio', front: 'Silent vs. missense vs. nonsense mutation?', back: 'Silent: same amino acid. Missense: a different amino acid. Nonsense: a premature stop codon, giving a truncated protein.' },

  // Experiments
  { id: 'fc-controls', category: 'experiments', front: 'Negative vs. positive control?', back: 'Negative: expected to show no effect (baseline). Positive: known to show the effect (proves the assay works).' },
  { id: 'fc-variables', category: 'experiments', front: 'Independent vs. dependent variable?', back: 'Independent: what you deliberately change. Dependent: what you measure in response.' },
  { id: 'fc-replicates', category: 'experiments', front: 'Why run replicates?', back: 'To estimate variability, so you can judge whether a difference is real or just noise.' },
]
