/**
 * Every ready-made 3D model in public/models: what it is called, which file it
 * is, where it came from, and which guides and red-result items show it. All of
 * them are CC0 (free for any use), see public/models/CREDITS.txt. This list is
 * written by hand in the sense that the matching was chosen by a person; add a
 * line here when a model is added.
 */
export interface Model3D {
  id: string;
  name: string;
  /** Path under /models. */
  file: string;
  source: "kenney" | "polyhaven";
  /** Guide ids that show this model. */
  guides: string[];
  /** Item ids (the ones with no guide) that show this model on their result. */
  items: string[];
}

export const MODELS: Model3D[] = [
  {"id": "bathroomsink", "name": "Bathroom sink", "file": "bathroomSink.glb", "source": "kenney", "guides": ["unclog-sink"], "items": []},
  {"id": "bathtub", "name": "Bathtub", "file": "bathtub.glb", "source": "kenney", "guides": ["recaulk-tub"], "items": []},
  {"id": "bear", "name": "Teddy bear", "file": "bear.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "bedbunk", "name": "Bunk bed", "file": "bedBunk.glb", "source": "kenney", "guides": [], "items": ["bunk-bed-crack"]},
  {"id": "bedsingle", "name": "Bed", "file": "bedSingle.glb", "source": "kenney", "guides": ["squeaky-bed"], "items": []},
  {"id": "bookcaseopen", "name": "Bookcase", "file": "bookcaseOpen.glb", "source": "kenney", "guides": [], "items": ["bookshelf-tipping"]},
  {"id": "books", "name": "Books", "file": "books.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "ceilingfan", "name": "Ceiling fan", "file": "ceilingFan.glb", "source": "kenney", "guides": [], "items": ["ceiling-fan-wobble"]},
  {"id": "chairdesk", "name": "Desk chair", "file": "chairDesk.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "computerkeyboard", "name": "Keyboard", "file": "computerKeyboard.glb", "source": "kenney", "guides": ["clean-keyboard"], "items": []},
  {"id": "computerscreen", "name": "Monitor", "file": "computerScreen.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "desk", "name": "Desk", "file": "desk.glb", "source": "kenney", "guides": ["reglue-veneer"], "items": []},
  {"id": "doorway", "name": "Door", "file": "doorway.glb", "source": "kenney", "guides": ["weatherstrip-door", "loose-door-handle"], "items": []},
  {"id": "dryer", "name": "Dryer", "file": "dryer.glb", "source": "kenney", "guides": ["dryer-lint"], "items": []},
  {"id": "kitchenblender", "name": "Blender", "file": "kitchenBlender.glb", "source": "kenney", "guides": ["blender-gasket"], "items": []},
  {"id": "kitchencabinet", "name": "Kitchen cabinet", "file": "kitchenCabinet.glb", "source": "kenney", "guides": ["cabinet-hinge"], "items": []},
  {"id": "kitchencoffeemachine", "name": "Coffee machine", "file": "kitchenCoffeeMachine.glb", "source": "kenney", "guides": ["coffee-maker-descale"], "items": []},
  {"id": "kitchenfridge", "name": "Fridge", "file": "kitchenFridge.glb", "source": "kenney", "guides": ["fridge-seal"], "items": []},
  {"id": "kitchenmicrowave", "name": "Microwave", "file": "kitchenMicrowave.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "kitchensink", "name": "Kitchen sink", "file": "kitchenSink.glb", "source": "kenney", "guides": ["disposal-jam"], "items": []},
  {"id": "kitchenstove", "name": "Stove", "file": "kitchenStove.glb", "source": "kenney", "guides": [], "items": ["gas-stove"]},
  {"id": "lamproundtable", "name": "Table lamp", "file": "lampRoundTable.glb", "source": "kenney", "guides": ["lamp-bulb-check"], "items": []},
  {"id": "laptop", "name": "Laptop", "file": "laptop.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "loungesofa", "name": "Sofa", "file": "loungeSofa.glb", "source": "kenney", "guides": ["upholstery-tear"], "items": []},
  {"id": "pottedplant", "name": "Potted plant", "file": "pottedPlant.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "radio", "name": "Radio", "file": "radio.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "shower", "name": "Shower", "file": "shower.glb", "source": "kenney", "guides": ["replace-showerhead"], "items": []},
  {"id": "speaker", "name": "Speaker", "file": "speaker.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "table", "name": "Table", "file": "table.glb", "source": "kenney", "guides": ["level-table"], "items": []},
  {"id": "tablecoffee", "name": "Coffee table", "file": "tableCoffee.glb", "source": "kenney", "guides": ["wood-scratch-finish"], "items": []},
  {"id": "televisionmodern", "name": "Television", "file": "televisionModern.glb", "source": "kenney", "guides": ["remote-not-working"], "items": ["tv-no-picture"]},
  {"id": "toaster", "name": "Toaster", "file": "toaster.glb", "source": "kenney", "guides": ["free-toaster-lever"], "items": []},
  {"id": "toilet", "name": "Toilet", "file": "toilet.glb", "source": "kenney", "guides": ["running-toilet", "toilet-seat"], "items": []},
  {"id": "trashcan", "name": "Trash can", "file": "trashcan.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "wallwindow", "name": "Window", "file": "wallWindow.glb", "source": "kenney", "guides": ["window-screen"], "items": []},
  {"id": "washer", "name": "Washer", "file": "washer.glb", "source": "kenney", "guides": ["washer-smell"], "items": []},
  {"id": "bucket", "name": "Bucket", "file": "camp/bucket.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "campfire-pit", "name": "Fire pit", "file": "camp/campfire-pit.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "chest", "name": "Chest", "file": "camp/chest.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "tent", "name": "Tent", "file": "camp/tent.glb", "source": "kenney", "guides": ["patch-tent"], "items": []},
  {"id": "tool-axe", "name": "Axe", "file": "camp/tool-axe.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "tool-hammer", "name": "Hammer", "file": "camp/tool-hammer.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "tool-shovel", "name": "Shovel", "file": "camp/tool-shovel.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "workbench", "name": "Workbench", "file": "camp/workbench.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "cone", "name": "Traffic cone", "file": "car/cone.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "hatchback-sports", "name": "Hatchback", "file": "car/hatchback-sports.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "sedan", "name": "Sedan", "file": "car/sedan.glb", "source": "kenney", "guides": ["wiper-blades", "cabin-air-filter", "washer-fluid", "headlight-bulb"], "items": ["car-brakes", "airbag-light", "fuel-smell", "car-overheating", "steering-loose"]},
  {"id": "suv", "name": "SUV", "file": "car/suv.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "taxi", "name": "Taxi", "file": "car/taxi.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "tractor", "name": "Tractor", "file": "car/tractor.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "truck", "name": "Truck", "file": "car/truck.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "van", "name": "Van", "file": "car/van.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "wheel-default", "name": "Car wheel", "file": "car/wheel-default.glb", "source": "kenney", "guides": ["tire-pressure"], "items": []},
  {"id": "wheel-racing", "name": "Racing wheel", "file": "car/wheel-racing.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "cooking-knife", "name": "Kitchen knife", "file": "food/cooking-knife.glb", "source": "kenney", "guides": ["sharpen-knife"], "items": []},
  {"id": "cutting-board", "name": "Cutting board", "file": "food/cutting-board.glb", "source": "kenney", "guides": ["oil-cutting-board"], "items": []},
  {"id": "frying-pan", "name": "Frying pan", "file": "food/frying-pan.glb", "source": "kenney", "guides": ["season-cast-iron"], "items": []},
  {"id": "knife-block", "name": "Knife block", "file": "food/knife-block.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "mug", "name": "Mug", "file": "food/mug.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "pan", "name": "Pan", "file": "food/pan.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "plate-broken", "name": "Broken plate", "file": "food/plate-broken.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "pot", "name": "Pot", "file": "food/pot.glb", "source": "kenney", "guides": ["loose-pot-handle"], "items": []},
  {"id": "rollingpin", "name": "Rolling pin", "file": "food/rollingPin.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "whisk", "name": "Whisk", "file": "food/whisk.glb", "source": "kenney", "guides": [], "items": []},
  {"id": "drill-01", "name": "Power drill", "file": "ph/Drill_01/Drill_01_1k.gltf", "source": "polyhaven", "guides": [], "items": ["chainsaw"]},
  {"id": "adjustable-wrench", "name": "Adjustable wrench", "file": "ph/adjustable_wrench/adjustable_wrench_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "classic-laptop", "name": "Laptop (scan)", "file": "ph/classic_laptop/classic_laptop_1k.gltf", "source": "polyhaven", "guides": [], "items": ["laptop-overheating"]},
  {"id": "combination-wrench", "name": "Combination wrench", "file": "ph/combination_wrench/combination_wrench_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "cross-pein-hammer", "name": "Hammer (scan)", "file": "ph/cross_pein_hammer/cross_pein_hammer_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "fire-alarm", "name": "Smoke alarm", "file": "ph/fire_alarm/fire_alarm_1k.gltf", "source": "polyhaven", "guides": ["smoke-alarm-chirp"], "items": []},
  {"id": "gamepad", "name": "Game controller", "file": "ph/gamepad/gamepad_1k.gltf", "source": "polyhaven", "guides": ["controller-drift"], "items": []},
  {"id": "garden-hose-wall-mounted-01", "name": "Garden hose", "file": "ph/garden_hose_wall_mounted_01/garden_hose_wall_mounted_01_1k.gltf", "source": "polyhaven", "guides": ["patch-hose"], "items": []},
  {"id": "handsaw-wood", "name": "Hand saw", "file": "ph/handsaw_wood/handsaw_wood_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "lightbulb-01", "name": "Light bulb", "file": "ph/lightbulb_01/lightbulb_01_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "lubricant-spray", "name": "Lubricant spray", "file": "ph/lubricant_spray/lubricant_spray_1k.gltf", "source": "polyhaven", "guides": ["lube-chain"], "items": []},
  {"id": "measuring-tape-01", "name": "Tape measure", "file": "ph/measuring_tape_01/measuring_tape_01_1k.gltf", "source": "polyhaven", "guides": ["hem-pants"], "items": []},
  {"id": "metal-toolbox", "name": "Toolbox", "file": "ph/metal_toolbox/metal_toolbox_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "old-tyre", "name": "Car tire", "file": "ph/old_tyre/old_tyre_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "pastic-torch-6v", "name": "Flashlight", "file": "ph/pastic_torch_6v/pastic_torch_6v_1k.gltf", "source": "polyhaven", "guides": ["battery-corrosion"], "items": []},
  {"id": "pipe-wrench", "name": "Pipe wrench", "file": "ph/pipe_wrench/pipe_wrench_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "pliers", "name": "Pliers", "file": "ph/pliers/pliers_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "plunger", "name": "Plunger", "file": "ph/plunger/plunger_1k.gltf", "source": "polyhaven", "guides": ["unclog-toilet"], "items": []},
  {"id": "power-box-01", "name": "Breaker box", "file": "ph/power_box_01/power_box_01_1k.gltf", "source": "polyhaven", "guides": [], "items": ["tripping-breaker"]},
  {"id": "propane-tank", "name": "Propane tank", "file": "ph/propane_tank/propane_tank_1k.gltf", "source": "polyhaven", "guides": [], "items": ["gas-grill-leak"]},
  {"id": "rubber-boots", "name": "Rubber boots", "file": "ph/rubber_boots/rubber_boots_1k.gltf", "source": "polyhaven", "guides": ["clean-waterproof-boots"], "items": []},
  {"id": "rubber-duck-toy", "name": "Rubber duck", "file": "ph/rubber_duck_toy/rubber_duck_toy_1k.gltf", "source": "polyhaven", "guides": ["glue-plastic"], "items": []},
  {"id": "screwdriver", "name": "Screwdriver", "file": "ph/screwdriver/screwdriver_1k.gltf", "source": "polyhaven", "guides": ["stripped-screw-hole"], "items": []},
  {"id": "tire-pump", "name": "Tire pump", "file": "ph/tire_pump/tire_pump_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "vintage-electric-kettle", "name": "Electric kettle", "file": "ph/vintage_electric_kettle/vintage_electric_kettle_1k.gltf", "source": "polyhaven", "guides": [], "items": []},
  {"id": "vintage-microwave", "name": "Microwave (scan)", "file": "ph/vintage_microwave/vintage_microwave_1k.gltf", "source": "polyhaven", "guides": [], "items": ["microwave"]},
  {"id": "wooden-ladder", "name": "Ladder", "file": "ph/wooden_ladder/wooden_ladder_1k.gltf", "source": "polyhaven", "guides": [], "items": ["ladder-damaged"]},
];

const byGuide = new Map<string, Model3D>();
const byItem = new Map<string, Model3D>();
for (const model of MODELS) {
  for (const guide of model.guides) byGuide.set(guide, model);
  for (const item of model.items) byItem.set(item, model);
}

export function modelForGuide(guideId: string): Model3D | undefined {
  return byGuide.get(guideId);
}

/** The model for an item: its own, or the one its guide shows. */
export function modelForItem(item: { id: string; guideId?: string }): Model3D | undefined {
  return byItem.get(item.id) ?? (item.guideId ? byGuide.get(item.guideId) : undefined);
}
