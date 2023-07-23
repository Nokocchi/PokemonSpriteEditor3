# -----------------------------------------------------------
# Traverses the /src directory containing all the sprites and writes the structure to .js as json
# I don't care about error handling here. This script is only meant to be run by me in the rare cases that
# I add, change or remove contents from the /src folder
# In order to minimize file size: [_t = type, _p = path, c = children, d = directory, f = file]
#
# Nokocchi, 2019
# -----------------------------------------------------------


import os
import json


def rec(path):
    name = os.path.basename(path)
    data = {}
    if os.path.isdir(path):
        data['_t'] = "d"
        data["_p"] = name
        data['c'] = [rec(os.path.join(path, x)) for x in os.listdir(path)]
    else:
        data["_t"] = "f"
        data["_p"] = name.replace(".png", "")
    return data


if __name__ == '__main__':
    os.chdir("src")
    root = os.getcwd()
    data = rec(root)
    os.chdir("../")
    dataStr = json.dumps(data, sort_keys=True)
    with open('imgDirStructure.js', 'w') as file:
        file.write("var getDirectoryAsJson = function(){ return ")
        json.dump(dataStr, file)
        file.write("}")
