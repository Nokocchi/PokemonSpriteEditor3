import os
import json
import re
from collections import defaultdict

data = defaultdict(list)
currPath = []


def rec(path):
    if os.path.isdir(path):
        for x in os.listdir(path):
            currPath.append(os.path.basename(path))
            rec(os.path.join(path, x))
            currPath.pop()
    else:
        file = os.path.basename(path);
        # If character before is / and character after is not a number
        nr = re.sub(r"[^0-9]+", "", file)
        fullPath = "/".join(currPath) + "/" + file
        data[nr].append(fullPath)
    return data


if __name__ == '__main__':
    os.chdir("src")
    root = os.getcwd()
    data = rec(root)
    os.chdir("../")
    dataStr = json.dumps(data, sort_keys=True)
    with open('pathByNr.js', 'w') as file:
        file.write("var getPathByNrMap = function(){ return ")
        json.dump(dataStr, file)
        file.write("}")