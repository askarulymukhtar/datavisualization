from nltk.corpus import wordnet as wn
import json

def closure_graph(synset,fn):
    seen = set()
    node = set()
    edge = list()
    synsets = []
    def recurse(s):
        if not s in seen:
            seen.add(s)
            print(s.lemma_names('eng')[0])
            for i in range(len(s.lemma_names('eng'))):
                node.add(s.lemma_names('eng')[i])
            #node.add(s.lemma_names('eng')[0])
            synsets.append(s.lemma_names('eng'))
            for s1 in fn(s):
                node.add(s1.lemma_names('eng')[0])
                edge.append({"source":s.lemma_names('eng')[0],"target":s1.lemma_names('eng')[0], "type":"hyper"})
                recurse(s1)
    recurse(synset)
    return (list(node),edge,synsets)

    
dog = wn.synset('dog.n.01')
graph = closure_graph(dog,lambda s: s.hypernyms())

vocabulary = []
for token in graph[0]:
    if token not in vocabulary:
        vocabulary.append(token)
json_1 = []
for i in range(len(vocabulary)):
    json_1.append({"id":i+1, "name": vocabulary[i]})

vocabulary_size = len(vocabulary)
print(json_1)

json_2 = graph[1] #will be used for hypernyms 

for i in range(len(graph[2])):
    for j in range(len(graph[2][i])):
        json_2.append({"source":graph[2][i][0], "target": graph[2][i][j], "type":"sin"})

for j in range(len(json_1)):
    for i in range(len(graph[1])):    
        if (json_1[j]['name'] ==  json_2[i]['source']):
            json_2[i]['source'] = json_1[j]['id']
        if (json_1[j]['name'] ==  json_2[i]['target']):
            json_2[i]['target'] = json_1[j]['id']

with open("wordnet2.json","w") as fh:
    json.dump({"nodes":json_1,"links":json_2},fh)