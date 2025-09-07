// Exillium Dolls Data Structure
export interface Doll {
  id: string;
  name: string;
  image: string;
  dispel: boolean;
  cleanse: boolean;
  abilities?: {
    dispel?: {
      description: string[];
      type?: "ST" | "AoE" | "Self" | "ST or AoE" | "Self & AoE";
    };
    cleanse?: {
      description: string[];
      type?: "ST" | "AoE" | "Self" | "ST or AoE" | "Self & AoE";
    };
  };
}

export const EXILIUM_DOLLS: Doll[] = [
  {
    id: "andoris",
    name: "Andoris",
    image: "/exilium/dolls/andoris.png",
    cleanse: true,
    dispel: false,
    abilities: {
      cleanse: {
        description: ["Applying Positive Charge on allies cleanses 2 debuffs","S3 provides AoE cleanse"],
        type: "AoE"
      }
    }
  },
  {
    id: "belka",
    name: "Belka",
    image: "/exilium/dolls/belka.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["Key 6 enables dispel before S3"],
        type: "ST"
      }
    }
  },
  {
    id: "centaureissi",
    name: "Centaureissi",
    image: "/exilium/dolls/centaureissi.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: [
          "Can apply Heat Recovery buff which enables dispel on receiving attack",
          "S2 can dispel if target has Overburn debuff"
        ]
      },
      cleanse: {
        description: [
          "S3 provides AoE cleanse",
          "Key 5 allows for targeted cleanse on heal",
          "Key 3 allows cleanse for targets with heat recovery"
        ],
        type: "ST or AoE"
      }
    }
  },
  {
    id: "cheeta",
    name: "Cheeta",
    image: "/exilium/dolls/cheeta.png",
    dispel: false,
    cleanse: true,
    abilities: {
      cleanse: {
        description: ["Key 5 allows S2 to cleanse"],
        type: "ST"
      }
    }
  },
  {
    id: "colphne",
    name: "Colphne",
    image: "/exilium/dolls/colphne.png",
    dispel: false,
    cleanse: true,
    abilities: {
      cleanse: {
        description: [
          "Key 5 allows S1 to cleanse",
          "Key 5 + 3 allows S2 to AoE cleanse on heal",
          "S3 cleanses"
        ],
        type: "ST or AoE"
      }
    }
  },
  {
    id: "daiyan",
    name: "Daiyan",
    image: "/exilium/dolls/daiyan.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["S1 can dispel"]
      }
    }
  },
  {
    id: "dushevnaya",
    name: "Dushevnaya",
    image: "/exilium/dolls/dushevnaya.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: [
          "Key 3 enables buff dispel when generating freeze tiles on an existing freeze tile",
          "S3 dispels at V5",
          "Active attacks dispel defense buff at V6"
        ]
      },
      cleanse: {
        description: ["Key 6 enables self cleanse on freeze tile at start of turn"],
        type: "Self"
      }
    }
  },
  {
    id: "faye",
    name: "Faye",
    image: "/exilium/dolls/faye.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "groza",
    name: "Groza",
    image: "/exilium/dolls/groza.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "jiangyu",
    name: "Jiangyu",
    image: "/exilium/dolls/jiangyu.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["S2 can dispel"],
        type: "ST"
      }
    }
  },
  {
    id: "klukai",
    name: "Klukai",
    image: "/exilium/dolls/klukai.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "krolik",
    name: "Krolik",
    image: "/exilium/dolls/krolik.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "ksenia",
    name: "Ksenia",
    image: "/exilium/dolls/ksenia.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: ["Can apply Heat Recovery buff which enables dispel on receiving attack"]
      },
      cleanse: {
        description: ["Key 5 allows burn buff application to cleanse"],
        type: "ST"
      }
    }
  },
  {
    id: "littara",
    name: "Littara",
    image: "/exilium/dolls/littara.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "lotta",
    name: "Lotta",
    image: "/exilium/dolls/lotta.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "makiatto",
    name: "Makiatto",
    image: "/exilium/dolls/makiatto.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "mechty",
    name: "Mechty",
    image: "/exilium/dolls/mechty.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: ["Key 5 enables BA to dispel"]
      },
      cleanse: {
        description: [
          "S2 self cleanse",
          "S3 enables all party members to be cleansed (cleanse on being attacked)",
          "V2 self cleanse on BA"
        ],
        type: "Self & AoE"
      }
    }
  },
  {
    id: "mosin",
    name: "Mosin",
    image: "/exilium/dolls/mosin.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "nagant",
    name: "Nagant",
    image: "/exilium/dolls/nagant.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "nemesis",
    name: "Nemesis",
    image: "/exilium/dolls/nemesis.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "nikketa",
    name: "Nikketa",
    image: "/exilium/dolls/nikketa.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "papasha",
    name: "Papasha",
    image: "/exilium/dolls/papasha.png",
    dispel: false,
    cleanse: true,
    abilities: {
      cleanse: {
        description: ["S2 self cleanse"],
        type: "Self"
      }
    }
  },
  {
    id: "peri",
    name: "Peri",
    image: "/exilium/dolls/peri.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: ["S1 can dispel at V5"]
      },
      cleanse: {
        description: ["Key 4 allows S3 to cleanse"],
        type: "Self"
      }
    }
  },
  {
    id: "peritya",
    name: "Peritya",
    image: "/exilium/dolls/peritya.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["S1 can dispel"]
      }
    }
  },
  {
    id: "qiongjiu",
    name: "Qiongjiu",
    image: "/exilium/dolls/qiongjiu.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["Key 2 enables dispel on action support"]
      }
    }
  },
  {
    id: "qiuhua",
    name: "Qiuhua",
    image: "/exilium/dolls/qiuhua.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "sabrina",
    name: "Sabrina",
    image: "/exilium/dolls/sabrina.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "sharkry",
    name: "Sharkry",
    image: "/exilium/dolls/sharkry.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "springfield",
    name: "Springfield",
    image: "/exilium/dolls/springfield.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: ["Key 2 enables dispel on active attack"],
        type: "ST"
      },
      cleanse: {
        description: ["S3 AoE cleanse"],
        type: "AoE"
      }
    }
  },
  {
    id: "suomi",
    name: "Suomi",
    image: "/exilium/dolls/suomi.png",
    dispel: false,
    cleanse: true,
    abilities: {
      cleanse: {
        description: ["S3 provides AoE cleanse"],
        type: "AoE"
      }
    }
  },
  {
    id: "tololo",
    name: "Tololo",
    image: "/exilium/dolls/tololo.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["Key 5 enables phase weakness exploit to dispel"]
      }
    }
  },
  {
    id: "ullrid",
    name: "Ullrid",
    image: "/exilium/dolls/ullrid.png",
    dispel: false,
    cleanse: false
  },
  {
    id: "vector",
    name: "Vector",
    image: "/exilium/dolls/vector.png",
    dispel: true,
    cleanse: false, // true once I have V2
    abilities: {
      dispel: {
        description: ["Key 3 enables dispel on active attack"]
      },
      /* cleanse: {
        description: ["S3 AoE cleanse at V2"],
        type: ""
      } */
    }
  },
  {
    id: "vepley",
    name: "Vepley",
    image: "/exilium/dolls/vepley.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["S2 can dispel"]
      }
    }
  },
  {
    id: "yoohee",
    name: "Yoohee",
    image: "/exilium/dolls/yoohee.png",
    dispel: true,
    cleanse: true,
    abilities: {
      dispel: {
        description: ["Key 3 enables S1 to dispel"]
      },
      cleanse: {
        description: [
          "V2 allows targeted cleanse with 2 bonus action",
          "Best Dancer will AoE cleanse if Passionate Spin was used at least once (2 bonus action)"
        ],
        type: "ST or AoE"
      }
    }
  },
  {
    id: "zhaohui",
    name: "Zhaohui",
    image: "/exilium/dolls/zhaohui.png",
    dispel: true,
    cleanse: false,
    abilities: {
      dispel: {
        description: ["Key 6 enables dispel on action support"]
      }
    }
  }
];

// Export dolls by ID for easy access
export const DOLLS_BY_ID: Record<string, Doll> = EXILIUM_DOLLS.reduce(
  (acc, doll) => ({
    ...acc,
    [doll.id]: doll
  }),
  {}
);
