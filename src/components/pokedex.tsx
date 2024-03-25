import c from "classnames";
import { useTheme } from "contexts/use-theme";
import { usePokemon, usePokemonList, useTextTransition } from "hooks";
import { useEffect, useState } from "react";
import { randomMode } from "utils/random";
import { Button } from "./button";
import { LedDisplay } from "./led-display";
import colors from "utils/colors";

import "./pokedex.css";

export function Pokedex() {
  const { theme } = useTheme();
  const { ready, resetTransition } = useTextTransition();
  const { pokemonList } = usePokemonList();
  const [i, setI] = useState(0);
  const { pokemon: selectedPokemon, pokemonTypes } = usePokemon(pokemonList[i]);
  const { pokemon: nextPokemon } = usePokemon(pokemonList[i + 1]);
  const types = selectedPokemon ? selectedPokemon.types : [];
  const [weaknesses, setWeaknesses] = useState< string[] >( [] );
  const [strengths, setStrengths] = useState< string[] >( [] );
  const [open, setOpen] = useState< boolean >(false)
  const [team, setTeam] = useState<string[]>([]);
  const [openTeam, setOpenTeam] = useState< boolean >(false)


  const prev = () => {
    resetTransition();
    if (i === 0) {
      setI(pokemonList.length - 1);
    }
    setI((i) => i - 1);
  };

  const next = () => {
    resetTransition();
    if (i === pokemonList.length - 1) {
      setI(0);
    }
    setI((i) => i + 1);
  };

  useEffect(() => {
    const calculator = () => {
      const weakSet = new Set<string>();
      const streSet = new Set<string>();

      pokemonTypes.forEach((type) => {
        const limit = Math.max(type.double_damage_from.length, type.half_damage_from.length);

        for (let i = 0; i < limit; i++) {
          const weak = type.double_damage_from[i]?.name;
          const stre = type.half_damage_from[i]?.name;

          if (weak) weakSet.add(weak);
          if (stre) streSet.add(stre);
        }
      });

      weakSet.forEach(value => {
        if (streSet.has(value)) {
          weakSet.delete(value);
          streSet.delete(value);
        }
      });

      setWeaknesses(Array.from(weakSet));
      setStrengths(Array.from(streSet));
    };

    calculator();
  }, [pokemonTypes, selectedPokemon]);

  const handleOpen = () =>{
    setOpen(!open)
  }  

  const handleOpenTeam = () =>{
    setOpenTeam(!openTeam)
  }  

  const addTeam = (url: string) => {
    const newTeam = new Set(team);
  
    if (newTeam.size < 6) {
      newTeam.add(url);
      setTeam([...newTeam]);     
      setOpenTeam(true)
    } else {
      alert('El equipo ya tiene 6 miembros, elimine uno');
    }
  }

  const removeTeam = (url: string): void => {
    const newTeam: Set<string> = new Set(team);
  
    if (newTeam.has(url)) {
      newTeam.delete(url);
      setTeam([...newTeam]);
    } else {
      console.log('El elemento no existe en el equipo');
    }
  }

  return (
    <div className="pokedex">
      {openTeam&&<div className={c("team", `main-pokedex-${theme}`)}>
        {
          [...team].map((img, index)=>(
            <div className="screen team-screen">
              <img
                className={c(
                  "sprite",
                  "obfuscated",
                  ready && "ready",
                  ready && `ready--${randomMode()}`
                )}
                src={img}
                alt={img}
                key={index}
                onClick={()=>removeTeam(img)}
              />
          </div>
          ))
        }
      </div>}
      <div className={c("main-pokedex", `main-pokedex-${theme}`)}>
        <div className="panel left-panel">
          <div className="screen main-screen">
            {selectedPokemon && (
              <img
                id="back"
                className={c(
                  "sprite",
                  "obfuscated",
                  ready && "ready",
                  ready && `ready--${randomMode()}`
                )}
                src={`./src/images/Backgrounds/${selectedPokemon?.types[0].type.name}.jpg`}
                alt={selectedPokemon.types[0].type.name}
              />
            )}
            {selectedPokemon && (
              <img
                id="front"
                className={c(
                  "sprite",
                  "obfuscated",
                  ready && "ready",
                  ready && `ready--${randomMode()}`
                )}
                src={selectedPokemon.sprites.other.home.front_default}
                alt={selectedPokemon.name}
                onClick={() => addTeam(selectedPokemon.sprites.front_default)}
              />
            )}
          </div>
          <div className="screen name-display">
            <div
              className={c(
                "name",
                "obfuscated",
                ready && "ready",
                ready && `ready--${randomMode()}`
              )}
            >
              {selectedPokemon?.name}
            </div>
          </div>
          <div className="types-display">
            {
              types.map((type, i)=>(
                <div
                  className={c(
                    "type",
                    "obfuscated",
                    ready && "ready",
                    ready && `ready--${randomMode()}`
                  )}
                  style={{ backgroundColor: colors[type.type.name] }}
                  key={i}
                >
                  {type.type.name}
                </div>
              ))
            }
          </div>
          <div className="controls-main">
            <Button label="strength" onClick={handleOpen} />
          </div>
        </div>
        <div className="panel right-panel">
          <div className="controls leds">
            <Button label="team" onClick={handleOpenTeam}/>
            <LedDisplay color="blue" />
            <LedDisplay color="red" />
            <LedDisplay color="yellow" />
          </div>
          <div className="screen second-screen">
            {nextPokemon && (
              <img
                className={c(
                  "sprite",
                  "obfuscated",
                  ready && "ready",
                  ready && `ready--${randomMode()}`
                )}
                src={nextPokemon.sprites.front_default}
                alt={nextPokemon.name}
              />
            )}
          </div>
          <div className="controls">
            <Button label="prev" onClick={prev} />
            <Button label="next" onClick={next} />
          </div>
        </div>
      </div>
      {open&&
      <div className={c("details", `main-pokedex-${theme}`)}>
        <div className="screen detail-screen">
          <div className="weak-detail">
            <div className="weak-title">
              <p> Weaknesses:</p>
            </div>
            <div className="weaknesses">
              {
                weaknesses.map((weak, i)=>(
                      <div
                        className={c(
                          "weak",
                          "obfuscated",
                          ready && "ready",
                          ready && `ready--${randomMode()}`
                        )}
                        style={{ backgroundColor: colors[weak] }}
                        key={i}
                      >
                        {weak}
                      </div>
                    ))
                }
            </div>
          </div>
          <div className="weak-detail">
            <div className="weak-title">
              <p>Strengs:</p>
            </div>
            <div className="weaknesses">
              {
                strengths.map((strength, i)=>(
                      <div
                        className={c(
                          "weak",
                          "obfuscated",
                          ready && "ready",
                          ready && `ready--${randomMode()}`
                        )}
                        style={{ backgroundColor: colors[strength] }}
                        key={i}
                      >
                        {strength}
                      </div>
                    ))
                }
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
