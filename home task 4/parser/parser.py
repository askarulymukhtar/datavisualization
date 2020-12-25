import json

# read file
with open('party1.json', encoding="utf8") as myfile:
    data = myfile.read()
with open('party2.json', encoding="utf8") as myfile:
    data2 = myfile.read()
with open('party3.json', encoding="utf8") as myfile:
    data3 = myfile.read()
with open('data.json', encoding="utf8") as myfile:
    data4 = myfile.read()
# parse file
objList = json.loads(data)
objList2 = json.loads(data2)
objList3 = json.loads(data3)
list = json.loads(data4)

newList = []

newList.append({
        'Name': 'АБСАТИРОВ Кенес Гарапович',
        'Committee': 'Комитет по социально-культурному развитию',
        'Party': 'АК ЖОЛ',
    })

for i in objList:
    newList.append({
        'Name': i["АБСАТИРОВ Кенес Гарапович"],
        'Committee': i["Комитет по социально-культурному развитию"],
        'Party': 'АК ЖОЛ',
    })

newList.append({
        'Name': 'АЙСИНА Майра Араповна',
        'Committee': 'Комитет по социально-культурному развитию',
        'Party': 'НУР ОТАН',
    })

for i in objList2:
    newList.append({
        'Name': i["АЙСИНА Майра Араповна"],
        'Committee': i["Комитет по экономической реформе и региональному развитию"],
        'Party': 'НУР ОТАН',
    })


newList.append({
        'Name': 'АХМЕТБЕКОВ Жамбыл Аужанович',
        'Committee': 'Комитет по социально-культурному развитию',
        'Party': 'Коммунистическая Народная партия Казахстана'
    })

for i in objList3:
    newList.append({
        'Name': i["АХМЕТБЕКОВ Жамбыл Аужанович"],
        'Committee': i["Комитет по социально-культурному развитию"],
        'Party': 'Коммунистическая Народная партия Казахстана',
        
    })


CommitteeList = []

for i in newList:
    if i["Committee"] not in CommitteeList:
        CommitteeList.append(i["Committee"])


for i in CommitteeList:
    count = 0
    for j in newList:
        if j["Committee"] == i:
            count = count + 1
    print(i, ": ", count)


