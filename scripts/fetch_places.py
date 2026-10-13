"""Saves a copy of the repair places OpenStreetMap knows in Southwest Washington to
src/data/osm-places.json, so "Local help" has real places right away and also works
when the live map service is busy or the phone is offline.

  python3 scripts/fetch_places.py

Run it again now and then to refresh. Data (c) OpenStreetMap contributors, ODbL."""
import datetime
import json
import os
import time
import urllib.parse
import urllib.request

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "data", "osm-places.json")
# south, west, north, east: Vancouver up to Centralia, the coast to the Gorge
BOX = (45.50, -124.20, 46.85, -121.40)
KINDS = {
    "shop": ["bicycle", "tailor", "sewing", "shoe_repair", "mobile_phone", "computer", "appliance", "repair",
             "hardware", "doityourself", "car_repair", "tyres", "garden_centre"],
    "craft": ["tailor", "dressmaker", "shoemaker", "electronics_repair", "upholsterer", "carpenter", "plumber",
              "electrician", "handyman", "hvac"],
    "amenity": ["bicycle_repair_station", "tool_library"],
}
KEEP_TAGS = ["name", "shop", "craft", "amenity", "phone", "contact:phone", "website", "contact:website",
             "addr:housenumber", "addr:street", "addr:city", "opening_hours"]
SERVERS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter",
           "https://maps.mail.ru/osm/tools/overpass/api/interpreter"]


def main():
    box = ",".join(str(n) for n in BOX)
    parts = "".join(f'nwr(area.wa)({box})["{key}"~"^({"|".join(values)})$"];' for key, values in KINDS.items())
    query = f'[out:json][timeout:180];area["ISO3166-2"="US-WA"]->.wa;({parts});out center tags;'
    data = None
    for attempt in range(6):
        server = SERVERS[attempt % len(SERVERS)]
        try:
            request = urllib.request.Request(server, urllib.parse.urlencode({"data": query}).encode(),
                                             {"User-Agent": "FixItWA03/0.1 (student project, data snapshot)"})
            with urllib.request.urlopen(request, timeout=200) as answer:
                data = json.load(answer)
            break
        except Exception as err:                    # a busy server, try the next one
            print(server, "did not answer:", err)
            time.sleep(5)
    if data is None:
        raise SystemExit("No server answered, the old file was kept.")

    places = []
    for e in data["elements"]:
        tags = e.get("tags", {})
        lat = e.get("lat", e.get("center", {}).get("lat"))
        lng = e.get("lon", e.get("center", {}).get("lon"))
        if lat is None or any(k.startswith(("disused:", "abandoned")) for k in tags) or tags.get("access") == "private":
            continue
        places.append({"type": e["type"], "id": e["id"], "lat": round(lat, 5), "lon": round(lng, 5),
                       "tags": {k: tags[k] for k in KEEP_TAGS if k in tags}})
    places.sort(key=lambda p: (p["type"], p["id"]))
    with open(OUT, "w") as f:
        json.dump({"fetched": datetime.date.today().isoformat(), "box": BOX,
                   "attribution": "© OpenStreetMap contributors, ODbL", "elements": places}, f,
                  ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(len(places), "places saved,", os.path.getsize(OUT) // 1024, "KB")


main()
