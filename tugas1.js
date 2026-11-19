const character = {
  name: "Aether",
  level: 12,
  baseStats: {
    hp: 200,
    atk: 35,
    def: 20,
    spd: 15,
  },
  equipped: {
    weapon: {
      id: "wpn-01",
      name: "Iron Broadsword",
      slot: "weapon",
      rarity: "common",
      statBonus: { atk: 12, spd: -2 },
    },
    armor: {
      id: "arm-01",
      name: "Leather Tunic",
      slot: "armor",
      rarity: "common",
      statBonus: { hp: 30, def: 8, spd: 2 },
    },
    accessory: null,
  },
  inventory: [
    {
      id: "wpn-02",
      name: "Flamebrand Katana",
      slot: "weapon",
      rarity: "rare",
      qty: 1,
      statBonus: { atk: 28, spd: 5 },
    },
    {
      id: "acc-01",
      name: "Ring of Vitality",
      slot: "accessory",
      rarity: "uncommon",
      qty: 2,
      statBonus: { hp: 50, def: 3 },
    },
    {
      id: "arm-02",
      name: "Mithril Chainmail",
      slot: "armor",
      rarity: "epic",
      qty: 1,
      statBonus: { hp: 80, def: 25, spd: -1 },
    },
    {
      id: "pot-01",
      name: "Elixir of Strength",
      slot: "consumable",
      rarity: "rare",
      qty: 3,
      statBonus: { atk: 5 },
    },
  ],
};

// ==========================================
// TULIS JAWABAN FUNGSI KAMU DI BAWAH INI
// ==========================================

function getTotalStats(char) {
  // TODO: Implementasi Misi 1

  const baseStats = Object.entries(char.baseStats);
  // console.log("Base stats:", baseStats);

  const statBonus = Object.values(char.equipped)
    .filter((item) => item != null)
    .map((item) => item.statBonus);
  // console.log("Equipped stat bonuses:", statBonus);

  // console.log(statBonus);

  const total = Object.fromEntries(
    baseStats.map(([key, value]) => {
      const bonus = statBonus.reduce((total, val) => {
        return total + (val[key] ?? 0);
      }, 0);

      return [key, value + bonus];
    }),
  );
  // console.log("Total stats:", total);

  // console.log(total);

  return total;
}

function equipItem(char, itemId) {
  const item = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === itemId;
  });
  // console.log("Item to equip:", item);

	// console.log(item);
	// console.log(item.slot);

  if (item === undefined || item.slot === "consumable") {
    return char;
  }

  const remainingItems = char.inventory.filter((inventoryItem) => inventoryItem.id !== itemId);
  // console.log("Inventory after removing item:", remainingItems);
  if (item.qty > 1) {
    remainingItems.push({ ...item, qty: item.qty - 1 });
  }

	// console.log(remainingItems);
	
  const oldEquippedItem = char.equipped[item.slot];
  // console.log("Previously equipped item:", oldEquippedItem);
	// console.log(oldEquippedItem);
	//
	
	
  const inventoryWithOldItem = [...remainingItems];
  // console.log("Inventory before returning old item:", inventoryWithOldItem);
  if (oldEquippedItem) {
    inventoryWithOldItem.push({ ...oldEquippedItem, qty: oldEquippedItem.qty ?? 1 });
  }
	// console.log(inventoryWithOldItem));
	
	
  const newChar = {
		...char,
    inventory: inventoryWithOldItem,
    equipped: {
			...char.equipped,
      [item.slot]: { ...item, qty: 1 },
    },
  };
  // console.log("Character after equipping:", newChar);
	
  return newChar;
}

function unequipItem(char, slotName) {
	const item = char.equipped[slotName];
	// console.log("Item to unequip:", item);
	// console.log(item));

  if (item === null || item === undefined) {
    return char;
  }

  const existingItem = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === item.id;
  });
  // console.log("Matching inventory item:", existingItem);

  let newInventory;
  // console.log("Inventory before unequipping:", char.inventory);

  if (existingItem !== undefined) {
    newInventory = char.inventory.map((inventoryItem) => {
      if (inventoryItem.id === item.id) {
        return { ...inventoryItem, qty: (inventoryItem.qty ?? 1) + 1 };
      }

      return inventoryItem;
    });
  } else {
    newInventory = [...char.inventory, { ...item, qty: item.qty ?? 1 }];
  }

  const newChar = {
    ...char,
    inventory: newInventory,
    equipped: { ...char.equipped, [slotName]: null },
  };
  // console.log("Character after unequipping:", newChar);

  return newChar;
}

function useConsumable(char, itemId) {
  const item = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === itemId && inventoryItem.slot === "consumable";
  });
  // console.log("Consumable to use:", item);

  if (item === undefined) {
    return char;
  }

  const baseStats = Object.entries(char.baseStats);
  // console.log("Base stats before consumable:", baseStats);
  const updatedStats = baseStats.map(([statName, currentValue]) => {
    const bonus = item.statBonus[statName] ?? 0;
    return [statName, currentValue + bonus];
  });
  const newBaseStats = Object.fromEntries(updatedStats);
  console.log("Base stats after consumable:", newBaseStats);

  const inventoryWithoutItem = char.inventory.filter((inventoryItem) => {
    return inventoryItem.id !== itemId;
  });
  console.log("Inventory without used consumable:", inventoryWithoutItem);
  let newInventory = inventoryWithoutItem;
  if (item.qty > 1) {
    newInventory = [...inventoryWithoutItem, { ...item, qty: item.qty - 1 }];
  }

  const newChar = {
    ...char,
    baseStats: newBaseStats,
    inventory: newInventory,
  };
  console.log("Character after using consumable:", newChar);

  return newChar;
}


function getInventorySummary(char) {
  // console.log("Inventory for summary:", char.inventory);
  const summary = char.inventory.reduce((currentSummary, item) => {
    const raritySummary = currentSummary[item.rarity] ?? {
      totalQty: 0,
      items: [],
    };

    let updatedItems = raritySummary.items;
    if (!raritySummary.items.includes(item.name)) {
      updatedItems = [...raritySummary.items, item.name];
    }

    const updatedRaritySummary = {
      totalQty: raritySummary.totalQty + (item.qty ?? 1),
      items: updatedItems,
    };
    // console.log("Updated rarity summary:", updatedRaritySummary);

    return {
      ...currentSummary,
      [item.rarity]: updatedRaritySummary,
    };
  }, {});
  // console.log("Final inventory summary:", summary);

  return summary;
}


function findBestUpgrade(char, slotName) {
  const current = char.equipped[slotName];
  console.log("Currently equipped item:", current);
  const candidates = char.inventory
    .filter((item) => item.slot === slotName)
    .map((item) => {
      const statBonuses = Object.entries(item.statBonus);
      const scoreGain = statBonuses.reduce((totalGain, [statName, itemBonus]) => {
        const currentBonus = current?.statBonus[statName] ?? 0;
        return totalGain + itemBonus - currentBonus;
      }, 0);

      return {
        itemName: item.name,
        scoreGain,
      };
    })
    .filter((candidate) => candidate.scoreGain > 0);
  console.log("Upgrade candidates:", candidates);

		// console.log(candidates)

  const bestUpgrade = candidates.reduce((best, candidate) => {
    if (best === null || candidate.scoreGain > best.scoreGain) {
      return candidate;
    }

    return best;
  }, null);
	console.log("Best upgrade:", bestUpgrade);
	// console.log(bestUpgrade)

  return bestUpgrade;
}

// ==========================================
// SCRIPT PENGUJIAN (TEST CASES)
// ==========================================

console.log("1. Initial Stats:", getTotalStats(character));
// Ekspektasi: { hp: 230, atk: 47, def: 28, spd: 15 }

const stateAfterWeapon = equipItem(character, "wpn-02");
const stateAfterAcc = equipItem(stateAfterWeapon, "acc-01");
console.log("2. Stats After Equip:", getTotalStats(stateAfterAcc));
// Ekspektasi: { hp: 280, atk: 63, def: 31, spd: 22 }
console.log(
  "   Inventory Weapon Swap:",
  stateAfterAcc.inventory.find((i) => i.id === "wpn-01"),
);
// Ekspektasi: { id: "wpn-01", name: "Iron Broadsword", slot: "weapon", rarity: "common", statBonus: { atk: 12, spd: -2 }, qty: 1 }

const stateAfterUnequip = unequipItem(stateAfterAcc, "accessory");
console.log(
  "3. Ring Qty After Unequip:",
  stateAfterUnequip.inventory.find((i) => i.id === "acc-01")?.qty,
);
// Ekspektasi: 2

const stateAfterPotion = useConsumable(stateAfterUnequip, "pot-01");
console.log("4. Base ATK After Elixir:", stateAfterPotion.baseStats.atk);
// Ekspektasi: 40

console.log("5. Inventory Summary:", getInventorySummary(character));
// Ekspektasi:
// {
//   rare: { totalQty: 4, items: ["Flamebrand Katana", "Elixir of Strength"] },
//   uncommon: { totalQty: 2, items: ["Ring of Vitality"] },
//   epic: { totalQty: 1, items: ["Mithril Chainmail"] }
// }

console.log("6. Best Armor Upgrade:", findBestUpgrade(character, "armor"));
// Ekspektasi: { itemName: "Mithril Chainmail", scoreGain: 64 }

console.log(
  "7. Immutability Check - Weapon:",
  character.equipped.weapon.name === "Iron Broadsword",
);
console.log(
  "   Immutability Check - Inventory:",
  character.inventory.length === 4,
);
