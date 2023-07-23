import json


if __name__ == '__main__':
    nameNr = {}
    nrName = {}
    with open('pokedex.json', encoding="utf8") as json_file:
        data = json.load(json_file)
        for pkmn in data:
            name = pkmn["name"]["english"]
            id = pkmn["id"]
            nameNr[name] = id
            nrName[id] = name

    nameNrStr = json.dumps(nameNr, sort_keys=True)
    with open('pkmnNameNrMap.js', 'w') as file:
        file.write("var getPkmnNameNrMap = function(){ return ")
        json.dump(nameNrStr, file)
        file.write("}")

    nrNameStr = json.dumps(nrName, sort_keys=True)
    with open('pkmnNrNameMap.js', 'w') as file:
        file.write("var getPkmnNrNameMap = function(){ return ")
        json.dump(nrNameStr, file)
        file.write("}")