// Birth date and time types
export interface BirthDateTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

// Location related types
export interface CountryIndex {
  name: string
  iso3: string
  emoji: string
}

export interface CountryDetail {
  name: string
  iso3: string
  emoji: string
  region: string
  subregion: string
  states: State[]
}

export interface State {
  name: string
  cities: string[]
}

export interface LocationValue {
  country?: string
  province?: string
  city?: string
}

// Life event related types
export interface LifeEvent {
  id: string
  lifeStage?: string
  lifeEvents?: {
    category: string
    description: string
    occurrenceYear?: number
  }[]
}

export interface EventListRow {
  id: string
  category: string | null
  description: string
  occurrenceYear?: number
}

// Event category option types
export interface EventCategory {
  label: string
  value: string
  placeholder: string
}
