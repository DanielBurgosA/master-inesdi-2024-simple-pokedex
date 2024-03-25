import type { Pokemon, PokemonUri } from "models";
import { useEffect, useState } from "react";

const cache = new Map<string, Pokemon>();

interface DamageRelation {
  name: string;
  url: string;
}

interface TypeInfo {
    double_damage_from: DamageRelation[];
    double_damage_to: DamageRelation[];
    half_damage_from: DamageRelation[];
    half_damage_to: DamageRelation[];
    no_damage_from: DamageRelation[];
    no_damage_to: DamageRelation[];
}

export function usePokemon(pokemonUri: PokemonUri) {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [pokemonTypes, setpokemonTypes] = useState<TypeInfo[]>([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(pokemonUri.url);
        const data = await response.json();
        cache.set(pokemonUri.url, data);
        setPokemon(data);

        const types = data.types;
        const typesInfo: TypeInfo[] = [];

        for (let i = 0; i < types.length; i++) {
          const infoResponse = await fetch(types[i].type.url);
          const infoData = await infoResponse.json();
                 
          const typeInfo: TypeInfo = {
            double_damage_from: infoData.damage_relations.double_damage_from,
            double_damage_to: infoData.damage_relations.double_damage_to,
            half_damage_from: infoData.damage_relations.half_damage_from,
            half_damage_to: infoData.damage_relations.half_damage_to,
            no_damage_from: infoData.damage_relations.no_damage_from,
            no_damage_to: infoData.damage_relations.no_damage_to
          };  

          typesInfo.push(typeInfo)
        }

        setpokemonTypes(typesInfo)

      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!pokemonUri) return;

    else {
      fetchPokemonData();
    }
  }, [pokemonUri]);

  return { pokemon, pokemonTypes, isLoading };
}
