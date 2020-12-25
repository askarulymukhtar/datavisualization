import json
from nltk.corpus import wordnet as wn

def closure_graph(synset,fn):
    seen = set()
    node = set()
    edge = list()
    def recurse(s):
        if not s in seen:
            seen.add(s)
            print(s.lemma_names('eng')[0])
            for i in range(len(s.lemma_names('eng'))):
                node.add(s.lemma_names('eng')[i])
            for s1 in fn(s):
                for i in range(len(s1.lemma_names('eng'))):
                    node.add(s1.lemma_names('eng')[i])
                for i in range(len(s.lemma_names('eng'))):
                    for j in range(len(s1.lemma_names('eng'))):
                        edge.append({"source":s.lemma_names('eng')[i],"target":s1.lemma_names('eng')[j]})
                        recurse(s1)
    recurse(synset)
    return (list(node),edge)

dog = wn.synset('dog.n.01')
graph = closure_graph(dog,lambda s: s.hypernyms())

vocabulary = []
for token in graph[0]:
    if token not in vocabulary:
        vocabulary.append(token)
json_1 = []
for i in range(len(vocabulary)):
    json_1.append({"id":i, "name": vocabulary[i]})

vocabulary_size = len(vocabulary)
print(json_1)

json_2 = graph[1]
for j in range(len(json_1)):
    for i in range(len(graph[1])):    
        if (json_1[j]['name'] ==  json_2[i]['source']):
            json_2[i]['source'] = json_1[j]['id']
        if (json_1[j]['name'] ==  json_2[i]['target']):
            json_2[i]['target'] = json_1[j]['id']

json_2 = graph[1]
for j in range(len(json_1)):
    for i in range(len(graph[1])):    
        if (json_1[j]['name'] ==  json_2[i]['source']):
            json_2[i]['source'] = json_1[j]['id']
        if (json_1[j]['name'] ==  json_2[i]['target']):
            json_2[i]['target'] = json_1[j]['id']