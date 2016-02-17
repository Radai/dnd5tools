var class_data = {
	"barbarian": {
		"hit_dice": "d12",
		"primary": "strength",
		"saving_throw": {"strength", "constitution"},
		"profincencies": {
			"armor": {
				"light",
				"medium",
				"shields"},
			"weapon": {
				"simple",
				"martial"
			}
		}
	},
	"bard": {
		"hit_dice": "d8",
		"primary": "charisma",
		"saving_throw": {"dexterity, charisma"},
		"profincencies": {
			"armor": {
				"light"
			},
			"weapon": {
				"simple",
				"hand_crossbows",
				"longswords",
				"rapiers"
			}
		}
	},
	"cleric": {
		"hit_dice": "d8",
		"primary": "wisdom",
		"saving_throw": {"wisdom, charisma"},
		"profincencies": {
			"armor": {
				"light",
				"medium",
				"shields"
			},
			"weapon": {
				"simple"
			}
		}
	},
	"druid": {
		"hit_dice": "d8",
		"primary": "wisdom",
		"saving_throw": {"intelligence, wisdom"},
		"profincencies": {
			"armor": {
				"light",
				"medium (non-metal)",
				"shields (non-metal)",
			},
			"weapon": {
				"clubs",
				"daggers",
				"darts",
				"javelins",
				"maces",
				"quarterstaffs",
				"scimitars",
				"sickles",
				"slings",
				"spears"
			}
		}
	},
	"fighter": {
		"hit_dice": "d10",
		"primary": {"strength","dexterity"} //pick one
		"saving_throw": {"strength, constitution"},
		"profincencies": {
			"armor": {
				"all",
				"shields"
			},
			"weapon": {
				"simple",
				"martial"
			}
		}
	},
	"monk": {
		"hit_dice": "d8",
		"primary": "dexterity",
		"saving_throw": {"dexterity", "strength"}, //lvl 14 gain prof in all
		"profincencies": {
			"armor": {},
			"weapon": {
				"simple",
				"shortsword"
			}
		}
	},
	"paladin": {
		"hit_dice": "d10",
		"primary": {"strength", "charisma"} //pick both
		"saving_throw": {"dexterity, charisma"},
		"profincencies": {
			"armor": {
				"all",
				"shields"
			},
			"weapon": {
				"simple",
				"martial"
			}
		}
	},
	"ranger": {
		"hit_dice": "d10",
		"primary": "dexterity",
		"saving_throw": {"dexterity, strength"},
		"profincencies": {
			"armor": {
				"light",
				"medium",
				"shields"
			},
			"weapon": {
				"simple",
				"martial"
			}
		}
	},
	"rogue": {
		"hit_dice": "d8",
		"primary": "dexterity",
		"saving_throw": {"dexterity", "intelligence"},
		"profincencies": {
			"armor": {
				"light"
			},
			"weapon": {
				"simple",
				"hand_crossbows",
				"longswords",
				"rapiers",
				"shortswords"
			}
		}
	},
	"sorcerer": {
		"hit_dice": "d6",
		"primary": "charisma",
		"saving_throw": {"constitution", "charisma"},
		"profincencies": {
			"armor": {},
			"weapon": {
				"daggers",
				"darts",
				"slings",
				"quarterstaffs",
				"light crossbows"
			}
		}
	},
	"warlock": {
		"hit_dice": "d8",
		"primary": "charisma",
		"saving_throw": {"wisdom", "charisma"},
		"profincencies": {
			"armor": {
				"light"
			},
			"weapon": {
				"simple"
			}
		}
	},
	"wizard": {
		"hit_dice": "d6",
		"primary": "intelligence",
		"saving_throw": {"intelligence", "wisdom"},
		"profincencies": {
			"armor": {},
			"weapon": {
				"daggers",
				"darts",
				"slings",
				"quarterstaffs",
				"light crossbows"
			}
		}
	},
}