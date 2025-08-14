export const selectOptionsMap = {
  country_of_residence: {
    title: 'Country of Residence',
    required: true,
    placeholder: 'Select your country',
    options: [
      {
        label: 'United States',
        value: 'united_states'
      },
      {
        label: 'China',
        value: 'china'
      },
      {
        label: 'United Kingdom',
        value: 'united_kingdom'
      },
      {
        label: 'Canada',
        value: 'canada'
      },
      {
        label: 'Australia',
        value: 'australia'
      },
      {
        label: 'Germany',
        value: 'germany'
      },
      {
        label: 'France',
        value: 'france'
      },
      {
        label: 'Japan',
        value: 'japan'
      },
      {
        label: 'South Korea',
        value: 'south_korea'
      },
      {
        label: 'India',
        value: 'india'
      },
      {
        label: 'Brazil',
        value: 'brazil'
      },
      {
        label: 'Russia',
        value: 'russia'
      },
      {
        label: 'Others',
        value: 'others'
      }
    ]
  },
  most_proficient_language: {
    title: 'Most Proficient Language',
    required: true,
    placeholder: 'Select your language',
    options: [
      {
        label: 'English',
        value: 'english'
      },
      {
        label: 'Chinese',
        value: 'chinese'
      },
      {
        label: 'Spanish',
        value: 'spanish'
      },
      {
        label: 'Arabic',
        value: 'arabic'
      },
      {
        label: 'Hindi / Urdu',
        value: 'hindi_urdu'
      },
      {
        label: 'French',
        value: 'french'
      },
      {
        label: 'Portuguese',
        value: 'portuguese'
      },
      {
        label: 'Russian',
        value: 'russian'
      },
      {
        label: 'Japanese',
        value: 'japanese'
      },
      {
        label: 'German',
        value: 'german'
      },
      {
        label: 'Others',
        value: 'others'
      }
    ]
  },
  education_level: {
    required: true,
    title: 'Education Level',
    placeholder: 'Select your education level',
    options: [
      {
        label: 'High School or below',
        value: 'high_school_or_below'
      },
      {
        label: `Associate or Bachelor's`,
        value: 'associate_or_bachelors'
      },
      {
        label: `Master's Degree`,
        value: 'masters_degree'
      },
      {
        label: `PhD or above`,
        value: 'phd_or_above'
      }
    ]
  },
  occupation: {
    required: true,
    title: 'Occupation',
    placeholder: 'Select your occupation',
    options: [
      {
        label: 'Student',
        value: 'student'
      },
      {
        label: 'Blockchain Professional',
        value: 'blockchain_professional'
      },
      {
        label: 'Software / Tech Professional',
        value: 'software_tech_professional'
      },
      {
        label: 'Entertainment Industry Worker',
        value: 'entertainment_industry_worker'
      },
      {
        label: 'Academic / Researcher',
        value: 'academic_researcher'
      },
      {
        label: 'Others',
        value: 'others'
      }
    ]
  },
  large_model_familiarity: {
    required: true,
    title: 'Large Language Model Familiarity',
    placeholder: 'Select your familiarity level',
    options: [
      {
        label: 'Never used any large language models',
        value: 'never_used'
      },
      {
        label: 'Occasional user',
        value: 'occasional_user'
      },
      {
        label: 'Heavy user, experienced with multiple large language models',
        value: 'heavy_user'
      },
      {
        label: `Expert level — familiar with underlying principles, capable of development and fine-tuning`,
        value: 'expert_level'
      }
    ]
  },
  coding_ability: {
    required: true,
    title: 'Coding Ability',
    placeholder: 'Select your coding ability',
    options: [
      {
        label: 'No coding experience',
        value: 'no_coding_experience'
      },
      {
        label: 'Can write simple scripts (e.g., Python)',
        value: 'can_write_simple_scripts'
      },
      {
        label: 'Professional developer with system-level skills',
        value: 'professional_developer'
      }
    ]
  },
  blockchain_domain_knowledge: {
    required: true,
    title: 'Blockchain Domain Knowledge',
    placeholder: 'Select your blockchain knowledge',
    options: [
      {
        label: 'Have only used wallets or exchanges',
        value: 'have_only_used'
      },
      {
        label: 'Able to view and understand transaction data on blockchain explorers',
        value: 'understand_transaction_data'
      },
      {
        label: 'Familiar with various crypto products and possess some analytical skills',
        value: 'some_analytical_skills'
      },
      {
        label: 'Professional Web3 practitioner',
        value: 'professional_web3_practitioner'
      }
    ]
  }
} as const
