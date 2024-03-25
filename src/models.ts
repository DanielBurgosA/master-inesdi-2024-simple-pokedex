export type PokedexTheme = "blue" | "red" | "yellow" | "green";
export type PokemonUri = {
  name: string;
  url: string;
};

export type PokemonAbility = {
  ability: {
    name: string;
    url: string;
  };
};

export type PokemonStat = {
  base_stat: number;
  stat: {
    name: string;
    url: string;
  };
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type Pokemon = {
  id: number;
  name: string;
  stats: PokemonStat[];
  types: PokemonType[];
  weight: number;
  height: number;
  abilities: PokemonAbility[];
  sprites: {
    other:{
      home:{
        front_default: string;
      }
    },
    front_default: string;   
  };
};
