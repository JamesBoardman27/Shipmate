import requests, json
response = requests.get("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getArea/0,50,20").text
# 0,50,20
# ^ represents the longitude, latidude, square radius
# first two numbers should be center of area you want to find vessels in.
# third should be distance from position you want it to search
data = json.loads(response)
print(data)

response = requests.get("https://web.cs.manchester.ac.uk/m31181jg/first_group_project/api/api.php/getByFilters/0,50,20,[Cargo,Passenger]").text
# Boolean values represent which filters are switched on
# They are in the following order: Cargo, Passenger, Tanker, Fishing
data = json.loads(response)
print(data)
