// LS 1A starter concept guides.
// These five categories reflect the official course description (an integrated
// introduction to chemistry, molecular biology, biochemistry, and cell biology). They are
// broad starting points, NOT a list of topics already covered in lecture. Add, rename,
// or reorder categories freely; flashcards and questions reference categories by `id`.
//
// `visual` names a figure component in src/components/LSFigures.jsx (optional).

export const lsCategories = [
  {
    id: 'chem',
    title: 'Chemical principles & molecular interactions',
    short: 'Chemistry',
    blurb: 'Why atoms share electrons unevenly, and how weak attractions add up to biology.',
    summary: [
      'Biology runs on chemistry. **Electronegativity**, an atom’s pull on shared electrons, makes O–H and N–H bonds **polar**: oxygen and nitrogen carry partial negative charges and the hydrogens carry partial positive charges.',
      'Polar groups take part in **noncovalent interactions**: hydrogen bonds, ionic interactions, and van der Waals attractions. Each is much weaker than a covalent bond, but many acting together hold molecules in specific shapes and let them bind each other **reversibly**.',
      'In water, nonpolar molecules cluster together. This **hydrophobic effect** happens mainly because clustering frees up water molecules that would otherwise be held in ordered cages around nonpolar surfaces, which increases entropy.',
      '**Acids and bases:** a group’s `pK_{a}` is the pH at which it is half protonated. When pH < `pK_{a}`, the protonated form predominates; when pH > `pK_{a}`, the deprotonated form predominates. So the pH of the environment decides whether a group is charged.',
      '**Free energy:** a process with `ΔG < 0` is spontaneous (it can proceed without energy input). `ΔG` says nothing about **speed**. Rates depend on the activation energy, which is what enzymes lower.',
    ],
    vocab: [
      { term: 'Electronegativity', def: 'An atom’s tendency to pull shared electrons toward itself (O and N ≫ C and H).' },
      { term: 'Hydrogen bond', def: 'Attraction between an H bonded to O/N and a lone pair on another O/N.' },
      { term: 'Ionic interaction', def: 'Attraction between opposite charges, e.g. –COO⁻ and –NH₃⁺.' },
      { term: 'Van der Waals', def: 'Weak, short-range attractions from fluctuating electron clouds. They add up over close-fitting surfaces.' },
      { term: 'Hydrophobic effect', def: 'Nonpolar groups cluster in water, increasing water’s entropy.' },
      { term: 'pKa', def: 'The pH at which a group is 50% protonated and 50% deprotonated.' },
      { term: 'ΔG', def: 'Change in free energy. Negative means spontaneous (exergonic); it does not determine rate.' },
    ],
    connections: [
      'Hydrogen bonds between bases hold the two DNA strands together (see Biological molecules).',
      'The hydrophobic effect drives protein folding and membrane formation (see Structure & function).',
      'Side-chain `pK_{a}` values set which amino acids are charged, and that affects what a protein can bind.',
    ],
    why: [
      'Medicines bind their targets through these same noncovalent interactions. A drug that binds too weakly does nothing, and one that binds the wrong partner causes side effects.',
      'Whether a drug molecule is charged at a given pH affects whether it can cross nonpolar cell membranes.',
    ],
    visual: 'protonation',
  },
  {
    id: 'structure',
    title: 'Molecular structure & biological function',
    short: 'Structure → function',
    blurb: 'Shape and surface chemistry decide what a molecule can bind and do.',
    summary: [
      'A molecule’s **function** follows from its **3D shape** and the **chemistry of its surface**: where the charges, hydrogen-bond partners, and nonpolar patches are. Binding requires both shape and chemical complementarity.',
      'Proteins are a central example. The **primary structure** (amino-acid sequence) determines how the chain folds: **secondary structure** (α-helices and β-sheets held by backbone hydrogen bonds), **tertiary structure** (the overall fold, often with a nonpolar core), and sometimes **quaternary structure** (several chains together).',
      'Amino-acid **side chains** differ in chemistry: nonpolar, polar uncharged, acidic (negatively charged at physiological pH), and basic (positively charged at physiological pH). Changing a single side chain can change folding or binding.',
      'Enzymes bind substrates in an **active site** shaped to stabilize the reaction’s transition state. Molecules that resemble the substrate can occupy the active site and block it (**competitive inhibition**). Many drugs work this way.',
    ],
    vocab: [
      { term: 'Primary structure', def: 'The sequence of amino acids, joined by peptide bonds.' },
      { term: 'Secondary structure', def: 'Local α-helices and β-sheets stabilized by backbone hydrogen bonds.' },
      { term: 'Tertiary structure', def: 'The full 3D fold of a single polypeptide.' },
      { term: 'Quaternary structure', def: 'The assembly of multiple polypeptide chains.' },
      { term: 'Active site', def: 'The region of an enzyme where substrate binds and catalysis happens.' },
      { term: 'Denaturation', def: 'Loss of 3D structure (and function) when noncovalent interactions are disrupted; the sequence is unchanged.' },
      { term: 'Competitive inhibitor', def: 'Competes with substrate for the active site; can be outcompeted by high substrate.' },
    ],
    connections: [
      'The nonpolar core of a folded protein is the hydrophobic effect in action (see Chemistry).',
      'A DNA mutation can change one amino acid and therefore a protein’s shape or surface (see Molecular biology).',
      'Experiments that vary substrate concentration can reveal how an inhibitor binds (see Experiments).',
    ],
    why: [
      'In sickle-cell disease, one amino-acid change in hemoglobin (glutamate → valine) replaces a charged surface side chain with a nonpolar one. The resulting sticky patch lets deoxygenated hemoglobin molecules aggregate into fibers.',
      'Structure-based drug design starts from the 3D shape of a target protein’s binding site.',
    ],
    visual: null,
  },
  {
    id: 'biomolecules',
    title: 'Biological molecules & their properties',
    short: 'Biomolecules',
    blurb: 'Nucleic acids, proteins, carbohydrates, and lipids: building blocks and bonds.',
    summary: [
      'Three major classes are **polymers** built from monomers: nucleic acids (nucleotides), proteins (amino acids), and polysaccharides (sugars). Monomers are joined by **condensation (dehydration)** reactions that release water, and separated by **hydrolysis**, which adds water back.',
      '**Nucleic acids:** each nucleotide has a phosphate, a five-carbon sugar, and a nitrogenous base. Nucleotides link through **phosphodiester bonds** between the 3′ carbon of one sugar and the 5′ phosphate of the next, which gives each strand a direction (5′ → 3′). In double-stranded DNA the strands are **antiparallel** and the bases pair A–T (2 hydrogen bonds) and G–C (3 hydrogen bonds).',
      '**Proteins:** amino acids are joined by **peptide (amide) bonds**. The backbone is the same for every protein; the side chains are what make each protein unique.',
      '**Lipids** are defined by being largely nonpolar rather than by being polymers. **Phospholipids** are **amphipathic**: they have a polar head and nonpolar tails. In water they spontaneously form **bilayers** with the tails tucked inside, which is the basis of every cell membrane.',
    ],
    vocab: [
      { term: 'Condensation', def: 'Joins two molecules and releases water.' },
      { term: 'Hydrolysis', def: 'Breaks a bond by adding water.' },
      { term: 'Phosphodiester bond', def: 'Links nucleotides (3′ sugar carbon to 5′ phosphate) in a strand.' },
      { term: 'Antiparallel', def: 'The two DNA strands run in opposite 5′→3′ directions.' },
      { term: 'Peptide bond', def: 'Amide bond between the carboxyl of one amino acid and the amino group of the next.' },
      { term: 'Amphipathic', def: 'Having both hydrophilic and hydrophobic regions.' },
      { term: 'Ribose vs. deoxyribose', def: 'RNA’s sugar has a 2′-OH group; DNA’s sugar lacks it.' },
    ],
    connections: [
      'The bilayer forms because of the hydrophobic effect (see Chemistry).',
      'Directionality (5′/3′) explains how polymerases build new strands (see Molecular biology).',
      'G–C pairs have three hydrogen bonds, so G–C-rich DNA generally needs more heat to separate.',
    ],
    why: [
      'Many antiviral nucleoside analogs work by mimicking normal nucleotides but lacking the 3′-OH needed to attach the next one, which stops chain growth.',
      'Membranes control what enters cells. Small nonpolar molecules cross easily, while ions and large polar molecules need protein channels or transporters.',
    ],
    visual: 'bilayer',
  },
  {
    id: 'molbio',
    title: 'Molecular biology & cellular processes',
    short: 'Molecular biology',
    blurb: 'How information flows from DNA to RNA to protein, and how viruses exploit it.',
    summary: [
      'The **central dogma** describes the usual flow of genetic information: DNA is **replicated**, **transcribed** into RNA, and RNA is **translated** into protein.',
      '**Replication** is **semi-conservative**: each new double helix keeps one parental strand. DNA polymerases add nucleotides only to a free **3′-OH**, so new strands are built 5′ → 3′, and synthesis needs a primer.',
      '**Transcription:** RNA polymerase reads a DNA template strand and builds a complementary RNA, also 5′ → 3′. **Translation:** ribosomes read mRNA three bases at a time. Each **codon** is matched by a tRNA anticodon carrying a specific amino acid. Of the 64 codons, 61 specify amino acids and 3 are stop signals; AUG is the usual start codon (methionine).',
      '**Mutations** change DNA sequence. A substitution can be silent (same amino acid), missense (different amino acid), or nonsense (premature stop). Insertions or deletions not in multiples of three cause **frameshifts**.',
      '**Viruses** carry genetic material but rely on host cells’ machinery to replicate. **Retroviruses** such as HIV carry an RNA genome and use **reverse transcriptase** to make a DNA copy. Because that enzyme is viral, it is a selective drug target.',
    ],
    vocab: [
      { term: 'Semi-conservative', def: 'Each daughter DNA molecule contains one old strand and one new strand.' },
      { term: 'Template strand', def: 'The DNA strand read by polymerase to build a complementary strand.' },
      { term: 'Codon', def: 'Three mRNA nucleotides that specify an amino acid or a stop signal.' },
      { term: 'Anticodon', def: 'Three tRNA nucleotides that base-pair with a codon.' },
      { term: 'Missense / nonsense', def: 'Substitution giving a different amino acid / a premature stop codon.' },
      { term: 'Frameshift', def: 'An insertion or deletion that shifts the reading frame of all later codons.' },
      { term: 'Reverse transcriptase', def: 'An enzyme that copies RNA into DNA (used by retroviruses).' },
    ],
    connections: [
      'Base-pairing rules come from hydrogen-bonding patterns (see Biological molecules).',
      'A missense mutation matters when it changes a side chain important for structure or binding (see Structure & function).',
      'Meselson and Stahl’s density experiment is the classic evidence for semi-conservative replication (see Experiments).',
    ],
    why: [
      'Antiviral strategies often target steps that are unique to the virus, such as reverse transcription, viral proteases, or viral entry, to limit harm to host cells.',
      'Understanding codons explains why some mutations are harmless and others are catastrophic.',
    ],
    visual: null,
  },
  {
    id: 'experiments',
    title: 'Scientific experiments, evidence & interpretation',
    short: 'Experiments',
    blurb: 'Variables, controls, and reading data like a scientist.',
    summary: [
      'Good experiments change one thing at a time. The **independent variable** is what you deliberately vary, the **dependent variable** is what you measure, and everything else is held constant (**controlled variables**).',
      '**Controls** make results interpretable. A **negative control** should show no effect and gives the baseline. A **positive control** should show the effect and proves the assay can detect it. A **vehicle control** checks that the solvent a compound is dissolved in has no effect of its own.',
      '**Replicates** reveal variability, so you can tell a real difference from noise. **Correlation** alone doesn’t establish causation; manipulating a variable in a controlled experiment does a better job.',
      'When interpreting data, describe the pattern first (“rate rises, then plateaus”), then propose the mechanism that best explains it, then ask what result would have contradicted you.',
    ],
    vocab: [
      { term: 'Independent variable', def: 'The factor the experimenter changes.' },
      { term: 'Dependent variable', def: 'The outcome that is measured.' },
      { term: 'Negative control', def: 'A condition expected to show no effect (baseline).' },
      { term: 'Positive control', def: 'A condition known to produce the effect (validates the assay).' },
      { term: 'Replicate', def: 'A repeat of the same condition to estimate variability.' },
      { term: 'Hypothesis', def: 'A testable, falsifiable explanation that makes predictions.' },
    ],
    connections: [
      'Enzyme assays with and without an inhibitor distinguish competitive from other mechanisms (see Structure & function).',
      'Density-gradient experiments tested models of DNA replication (see Molecular biology).',
    ],
    why: [
      'Clinical trials rely on the same logic: randomization, controls (placebo or standard treatment), and enough participants to tell signal from noise.',
    ],
    visual: 'inhibition',
  },
]
