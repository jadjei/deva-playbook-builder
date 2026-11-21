// Placeholder assignments. The real text is the intellectual property of Edify Systems
// Limited and is not in this repository; see NOTICE. Generate your own with
// gen-playbook-config.py from https://github.com/jadjei/deva-course, which writes this format.
// The ids below are localStorage keys, so changing one silently orphans a learner's saved answer.
//
// 9 modules, 45 prompts, 347 fields.
import type { AssignmentDef } from "./types";

export const ASSIGNMENTS: AssignmentDef[] = [
  {
    "module": "000",
    "moduleName": "Orientation",
    "code": "000.a",
    "title": "Module 000 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "000-venture-snapshot",
        "label": "Module 000, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 000.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "000-what-you-want",
        "label": "Module 000, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 000.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "000-how-you-will-make-the-time",
        "label": "Module 000, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 000.",
        "size": "short"
      }
    ]
  },
  {
    "module": "100",
    "moduleName": "Our Changing World",
    "code": "100.4a",
    "title": "Module 100 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "100-decision-in-play",
        "label": "Module 100, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 100.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "100-vuca-reading",
        "label": "Module 100, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 100.",
        "rows": [
          {
            "key": "volatility",
            "label": "Row 1"
          },
          {
            "key": "uncertainty",
            "label": "Row 2"
          },
          {
            "key": "complexity",
            "label": "Row 3"
          },
          {
            "key": "ambiguity",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "observation",
            "label": "Column 1"
          },
          {
            "key": "next_question",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "100-bani-pressure",
        "label": "Module 100, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 100.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "100-technology-watch",
        "label": "Module 100, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 100.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "100-survive-stabilise-thrive",
        "label": "Module 100, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 100.",
        "rows": [
          {
            "key": "survive",
            "label": "Row 1"
          },
          {
            "key": "stabilise",
            "label": "Row 2"
          },
          {
            "key": "thrive",
            "label": "Row 3"
          }
        ],
        "columns": [
          {
            "key": "today",
            "label": "Column 1"
          },
          {
            "key": "next_move",
            "label": "Column 2"
          }
        ]
      }
    ]
  },
  {
    "module": "200",
    "moduleName": "Your Journey Toolkit",
    "code": "207.a",
    "title": "Module 200 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "200-reality-vision-bridge",
        "label": "Module 200, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 200.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "200-full-value-audit",
        "label": "Module 200, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 200.",
        "rows": [
          {
            "key": "purpose",
            "label": "Row 1"
          },
          {
            "key": "value-model",
            "label": "Row 2"
          },
          {
            "key": "finance",
            "label": "Row 3"
          },
          {
            "key": "revenue-operations",
            "label": "Row 4"
          },
          {
            "key": "support-operations",
            "label": "Row 5"
          },
          {
            "key": "capability",
            "label": "Row 6"
          },
          {
            "key": "commercial-assets",
            "label": "Row 7"
          },
          {
            "key": "relationship-assets",
            "label": "Row 8"
          },
          {
            "key": "product-proposition",
            "label": "Row 9"
          },
          {
            "key": "value-proposition",
            "label": "Row 10"
          },
          {
            "key": "customer-proposition",
            "label": "Row 11"
          },
          {
            "key": "positioning",
            "label": "Row 12"
          },
          {
            "key": "partner-proposition",
            "label": "Row 13"
          },
          {
            "key": "external-environment",
            "label": "Row 14"
          },
          {
            "key": "funding",
            "label": "Row 15"
          },
          {
            "key": "relationships",
            "label": "Row 16"
          }
        ],
        "columns": [
          {
            "key": "importance",
            "label": "Column 1"
          },
          {
            "key": "performance",
            "label": "Column 2"
          },
          {
            "key": "capability",
            "label": "Column 3"
          },
          {
            "key": "evidence",
            "label": "Column 4"
          }
        ]
      },
      {
        "kind": "text",
        "id": "200-material-finding",
        "label": "Module 200, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 200.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "200-value-model",
        "label": "Module 200, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 200.",
        "rows": [
          {
            "key": "create",
            "label": "Row 1"
          },
          {
            "key": "deliver",
            "label": "Row 2"
          },
          {
            "key": "capture",
            "label": "Row 3"
          }
        ],
        "columns": [
          {
            "key": "how",
            "label": "Column 1"
          },
          {
            "key": "activity",
            "label": "Column 2"
          },
          {
            "key": "dependency",
            "label": "Column 3"
          },
          {
            "key": "assumption",
            "label": "Column 4"
          }
        ]
      },
      {
        "kind": "text",
        "id": "200-asset-investment",
        "label": "Module 200, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 200.",
        "size": "long"
      }
    ]
  },
  {
    "module": "300",
    "moduleName": "Your Why, Your Essence",
    "code": "306.a",
    "title": "Module 300 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "300-entity-and-purpose",
        "label": "Module 300, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 300.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "300-vision-and-intent",
        "label": "Module 300, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 300.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "300-value-and-exchange",
        "label": "Module 300, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 300.",
        "rows": [
          {
            "key": "economic",
            "label": "Row 1"
          },
          {
            "key": "cultural",
            "label": "Row 2"
          },
          {
            "key": "societal",
            "label": "Row 3"
          }
        ],
        "columns": [
          {
            "key": "beneficiary",
            "label": "Column 1"
          },
          {
            "key": "we_give",
            "label": "Column 2"
          },
          {
            "key": "comes_back",
            "label": "Column 3"
          },
          {
            "key": "outcome",
            "label": "Column 4"
          }
        ]
      },
      {
        "kind": "table",
        "id": "300-business-model",
        "label": "Module 300, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 300.",
        "rows": [
          {
            "key": "create",
            "label": "Row 1"
          },
          {
            "key": "deliver",
            "label": "Row 2"
          },
          {
            "key": "capture",
            "label": "Row 3"
          },
          {
            "key": "community",
            "label": "Row 4"
          },
          {
            "key": "support",
            "label": "Row 5"
          }
        ],
        "columns": [
          {
            "key": "inside",
            "label": "Column 1"
          },
          {
            "key": "outside",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "300-finance-model",
        "label": "Module 300, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 300.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "300-growth-engine",
        "label": "Module 300, prompt 6",
        "hint": "Placeholder hint for prompt 6 of module 300.",
        "rows": [
          {
            "key": "today",
            "label": "Row 1"
          },
          {
            "key": "tomorrow",
            "label": "Row 2"
          }
        ],
        "columns": [
          {
            "key": "commercial",
            "label": "Column 1"
          },
          {
            "key": "cultural",
            "label": "Column 2"
          }
        ]
      }
    ]
  },
  {
    "module": "400",
    "moduleName": "Market Biome",
    "code": "405.a",
    "title": "Module 400 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "table",
        "id": "400-five-propositions",
        "label": "Module 400, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 400.",
        "rows": [
          {
            "key": "product",
            "label": "Row 1"
          },
          {
            "key": "value",
            "label": "Row 2"
          },
          {
            "key": "customer",
            "label": "Row 3"
          },
          {
            "key": "positioning",
            "label": "Row 4"
          },
          {
            "key": "partner",
            "label": "Row 5"
          }
        ],
        "columns": [
          {
            "key": "statement",
            "label": "Column 1"
          },
          {
            "key": "support",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "400-value-proposition",
        "label": "Module 400, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 400.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "400-customer-avatar",
        "label": "Module 400, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 400.",
        "rows": [
          {
            "key": "situation",
            "label": "Row 1"
          },
          {
            "key": "job",
            "label": "Row 2"
          },
          {
            "key": "pains",
            "label": "Row 3"
          },
          {
            "key": "gains",
            "label": "Row 4"
          },
          {
            "key": "deciders",
            "label": "Row 5"
          },
          {
            "key": "promise",
            "label": "Row 6"
          }
        ],
        "columns": [
          {
            "key": "entry",
            "label": "Column 1"
          },
          {
            "key": "evidence",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "table",
        "id": "400-positioning",
        "label": "Module 400, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 400.",
        "rows": [
          {
            "key": "product",
            "label": "Row 1"
          },
          {
            "key": "price",
            "label": "Row 2"
          },
          {
            "key": "market",
            "label": "Row 3"
          },
          {
            "key": "service",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "choice",
            "label": "Column 1"
          },
          {
            "key": "backing",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "400-partner-proposition",
        "label": "Module 400, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 400.",
        "size": "long"
      }
    ]
  },
  {
    "module": "500",
    "moduleName": "Internal Biome",
    "code": "502.a",
    "title": "Module 500 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "table",
        "id": "500-revenue-engine",
        "label": "Module 500, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 500.",
        "rows": [
          {
            "key": "marketing",
            "label": "Row 1"
          },
          {
            "key": "sales",
            "label": "Row 2"
          },
          {
            "key": "production",
            "label": "Row 3"
          },
          {
            "key": "client_services",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "who",
            "label": "Column 1"
          },
          {
            "key": "weak_handover",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "500-capability-constraint",
        "label": "Module 500, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 500.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "500-commercial-assets",
        "label": "Module 500, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 500.",
        "rows": [
          {
            "key": "equipment_and_cash",
            "label": "Row 1"
          },
          {
            "key": "software_you_built",
            "label": "Row 2"
          },
          {
            "key": "rights_and_licences",
            "label": "Row 3"
          },
          {
            "key": "customer_relationships",
            "label": "Row 4"
          },
          {
            "key": "knowledge",
            "label": "Row 5"
          }
        ],
        "columns": [
          {
            "key": "what",
            "label": "Column 1"
          },
          {
            "key": "control",
            "label": "Column 2"
          },
          {
            "key": "recognition",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "table",
        "id": "500-relationship-assets",
        "label": "Module 500, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 500.",
        "rows": [
          {
            "key": "communications",
            "label": "Row 1"
          },
          {
            "key": "culture",
            "label": "Row 2"
          },
          {
            "key": "leadership",
            "label": "Row 3"
          },
          {
            "key": "talent",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "observed",
            "label": "Column 1"
          },
          {
            "key": "effect",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "500-internal-audit-finding",
        "label": "Module 500, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 500.",
        "size": "long"
      }
    ]
  },
  {
    "module": "600",
    "moduleName": "External Biome",
    "code": "603.a",
    "title": "Module 600 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "table",
        "id": "600-pestle-scan",
        "label": "Module 600, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 600.",
        "rows": [
          {
            "key": "political",
            "label": "Row 1"
          },
          {
            "key": "economic",
            "label": "Row 2"
          },
          {
            "key": "social",
            "label": "Row 3"
          },
          {
            "key": "technological",
            "label": "Row 4"
          },
          {
            "key": "legal",
            "label": "Row 5"
          },
          {
            "key": "environmental",
            "label": "Row 6"
          }
        ],
        "columns": [
          {
            "key": "observation",
            "label": "Column 1"
          },
          {
            "key": "decision",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "600-funding-need",
        "label": "Module 600, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 600.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "600-funding-routes",
        "label": "Module 600, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 600.",
        "rows": [
          {
            "key": "current_resources",
            "label": "Row 1"
          },
          {
            "key": "public",
            "label": "Row 2"
          },
          {
            "key": "loan",
            "label": "Row 3"
          },
          {
            "key": "investment",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "what_it_funds",
            "label": "Column 1"
          },
          {
            "key": "commitments",
            "label": "Column 2"
          },
          {
            "key": "realistic",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "table",
        "id": "600-relationship-map",
        "label": "Module 600, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 600.",
        "rows": [
          {
            "key": "owners",
            "label": "Row 1"
          },
          {
            "key": "users",
            "label": "Row 2"
          },
          {
            "key": "contributors",
            "label": "Row 3"
          },
          {
            "key": "funders",
            "label": "Row 4"
          },
          {
            "key": "partners",
            "label": "Row 5"
          },
          {
            "key": "community",
            "label": "Row 6"
          }
        ],
        "columns": [
          {
            "key": "who",
            "label": "Column 1"
          },
          {
            "key": "needs",
            "label": "Column 2"
          },
          {
            "key": "influence",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "text",
        "id": "600-connected-response",
        "label": "Module 600, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 600.",
        "size": "long"
      }
    ]
  },
  {
    "module": "700",
    "moduleName": "The Journey",
    "code": "704.a",
    "title": "Module 700 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "700-playbook-thread",
        "label": "Module 700, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 700.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "700-development-priorities",
        "label": "Module 700, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 700.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "700-dashboard",
        "label": "Module 700, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 700.",
        "rows": [
          {
            "key": "income",
            "label": "Row 1"
          },
          {
            "key": "effectiveness",
            "label": "Row 2"
          },
          {
            "key": "assets",
            "label": "Row 3"
          },
          {
            "key": "purpose",
            "label": "Row 4"
          }
        ],
        "columns": [
          {
            "key": "measure",
            "label": "Column 1"
          },
          {
            "key": "owner",
            "label": "Column 2"
          },
          {
            "key": "decision",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "table",
        "id": "700-scenarios",
        "label": "Module 700, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 700.",
        "rows": [
          {
            "key": "lower",
            "label": "Row 1"
          },
          {
            "key": "expected",
            "label": "Row 2"
          },
          {
            "key": "higher",
            "label": "Row 3"
          }
        ],
        "columns": [
          {
            "key": "signal",
            "label": "Column 1"
          },
          {
            "key": "response",
            "label": "Column 2"
          },
          {
            "key": "owner",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "table",
        "id": "700-implementation-plan",
        "label": "Module 700, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 700.",
        "rows": [
          {
            "key": "discover",
            "label": "Row 1"
          },
          {
            "key": "define",
            "label": "Row 2"
          },
          {
            "key": "design",
            "label": "Row 3"
          },
          {
            "key": "deploy",
            "label": "Row 4"
          },
          {
            "key": "review",
            "label": "Row 5"
          }
        ],
        "columns": [
          {
            "key": "work",
            "label": "Column 1"
          },
          {
            "key": "owner",
            "label": "Column 2"
          },
          {
            "key": "milestone",
            "label": "Column 3"
          },
          {
            "key": "evidence",
            "label": "Column 4"
          }
        ]
      }
    ]
  },
  {
    "module": "800",
    "moduleName": "Leadership Playbook",
    "code": "800.a",
    "title": "Module 800 assignment",
    "intro": "Placeholder. The assignment text is the intellectual property of Edify Systems Limited and is not part of this repository.",
    "prompts": [
      {
        "kind": "text",
        "id": "800-situation",
        "label": "Module 800, prompt 1",
        "hint": "Placeholder hint for prompt 1 of module 800.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "800-leadership-stance",
        "label": "Module 800, prompt 2",
        "hint": "Placeholder hint for prompt 2 of module 800.",
        "rows": [
          {
            "key": "lead-follow",
            "label": "Row 1"
          },
          {
            "key": "orientation",
            "label": "Row 2"
          },
          {
            "key": "response",
            "label": "Row 3"
          },
          {
            "key": "self-regulation",
            "label": "Row 4"
          },
          {
            "key": "cognitive-flexibility",
            "label": "Row 5"
          },
          {
            "key": "adaptive-capacity",
            "label": "Row 6"
          },
          {
            "key": "relational-strength",
            "label": "Row 7"
          },
          {
            "key": "complementary",
            "label": "Row 8"
          }
        ],
        "columns": [
          {
            "key": "now",
            "label": "Column 1"
          },
          {
            "key": "needed",
            "label": "Column 2"
          },
          {
            "key": "change",
            "label": "Column 3"
          }
        ]
      },
      {
        "kind": "text",
        "id": "800-culture-behaviour",
        "label": "Module 800, prompt 3",
        "hint": "Placeholder hint for prompt 3 of module 800.",
        "size": "long"
      },
      {
        "kind": "table",
        "id": "800-conversation-prep",
        "label": "Module 800, prompt 4",
        "hint": "Placeholder hint for prompt 4 of module 800.",
        "rows": [
          {
            "key": "person",
            "label": "Row 1"
          },
          {
            "key": "pattern",
            "label": "Row 2"
          },
          {
            "key": "trust",
            "label": "Row 3"
          },
          {
            "key": "agenda",
            "label": "Row 4"
          },
          {
            "key": "positioning",
            "label": "Row 5"
          },
          {
            "key": "find",
            "label": "Row 6"
          },
          {
            "key": "respond",
            "label": "Row 7"
          },
          {
            "key": "pause",
            "label": "Row 8"
          },
          {
            "key": "summary-next",
            "label": "Row 9"
          }
        ],
        "columns": [
          {
            "key": "say",
            "label": "Column 1"
          },
          {
            "key": "listen",
            "label": "Column 2"
          }
        ]
      },
      {
        "kind": "text",
        "id": "800-founder-journey",
        "label": "Module 800, prompt 5",
        "hint": "Placeholder hint for prompt 5 of module 800.",
        "size": "long"
      },
      {
        "kind": "text",
        "id": "800-playbook-action",
        "label": "Module 800, prompt 6",
        "hint": "Placeholder hint for prompt 6 of module 800.",
        "size": "long"
      }
    ]
  }
];

/** Every field id the builder can store, for validating restored backups. */
export const FIELD_IDS: ReadonlySet<string> = new Set(["000-how-you-will-make-the-time", "000-venture-snapshot", "000-what-you-want", "100-bani-pressure", "100-decision-in-play", "100-survive-stabilise-thrive", "100-survive-stabilise-thrive.stabilise.next_move", "100-survive-stabilise-thrive.stabilise.today", "100-survive-stabilise-thrive.survive.next_move", "100-survive-stabilise-thrive.survive.today", "100-survive-stabilise-thrive.thrive.next_move", "100-survive-stabilise-thrive.thrive.today", "100-technology-watch", "100-vuca-reading", "100-vuca-reading.ambiguity.next_question", "100-vuca-reading.ambiguity.observation", "100-vuca-reading.complexity.next_question", "100-vuca-reading.complexity.observation", "100-vuca-reading.uncertainty.next_question", "100-vuca-reading.uncertainty.observation", "100-vuca-reading.volatility.next_question", "100-vuca-reading.volatility.observation", "200-asset-investment", "200-full-value-audit", "200-full-value-audit.capability.capability", "200-full-value-audit.capability.evidence", "200-full-value-audit.capability.importance", "200-full-value-audit.capability.performance", "200-full-value-audit.commercial-assets.capability", "200-full-value-audit.commercial-assets.evidence", "200-full-value-audit.commercial-assets.importance", "200-full-value-audit.commercial-assets.performance", "200-full-value-audit.customer-proposition.capability", "200-full-value-audit.customer-proposition.evidence", "200-full-value-audit.customer-proposition.importance", "200-full-value-audit.customer-proposition.performance", "200-full-value-audit.external-environment.capability", "200-full-value-audit.external-environment.evidence", "200-full-value-audit.external-environment.importance", "200-full-value-audit.external-environment.performance", "200-full-value-audit.finance.capability", "200-full-value-audit.finance.evidence", "200-full-value-audit.finance.importance", "200-full-value-audit.finance.performance", "200-full-value-audit.funding.capability", "200-full-value-audit.funding.evidence", "200-full-value-audit.funding.importance", "200-full-value-audit.funding.performance", "200-full-value-audit.partner-proposition.capability", "200-full-value-audit.partner-proposition.evidence", "200-full-value-audit.partner-proposition.importance", "200-full-value-audit.partner-proposition.performance", "200-full-value-audit.positioning.capability", "200-full-value-audit.positioning.evidence", "200-full-value-audit.positioning.importance", "200-full-value-audit.positioning.performance", "200-full-value-audit.product-proposition.capability", "200-full-value-audit.product-proposition.evidence", "200-full-value-audit.product-proposition.importance", "200-full-value-audit.product-proposition.performance", "200-full-value-audit.purpose.capability", "200-full-value-audit.purpose.evidence", "200-full-value-audit.purpose.importance", "200-full-value-audit.purpose.performance", "200-full-value-audit.relationship-assets.capability", "200-full-value-audit.relationship-assets.evidence", "200-full-value-audit.relationship-assets.importance", "200-full-value-audit.relationship-assets.performance", "200-full-value-audit.relationships.capability", "200-full-value-audit.relationships.evidence", "200-full-value-audit.relationships.importance", "200-full-value-audit.relationships.performance", "200-full-value-audit.revenue-operations.capability", "200-full-value-audit.revenue-operations.evidence", "200-full-value-audit.revenue-operations.importance", "200-full-value-audit.revenue-operations.performance", "200-full-value-audit.support-operations.capability", "200-full-value-audit.support-operations.evidence", "200-full-value-audit.support-operations.importance", "200-full-value-audit.support-operations.performance", "200-full-value-audit.value-model.capability", "200-full-value-audit.value-model.evidence", "200-full-value-audit.value-model.importance", "200-full-value-audit.value-model.performance", "200-full-value-audit.value-proposition.capability", "200-full-value-audit.value-proposition.evidence", "200-full-value-audit.value-proposition.importance", "200-full-value-audit.value-proposition.performance", "200-material-finding", "200-reality-vision-bridge", "200-value-model", "200-value-model.capture.activity", "200-value-model.capture.assumption", "200-value-model.capture.dependency", "200-value-model.capture.how", "200-value-model.create.activity", "200-value-model.create.assumption", "200-value-model.create.dependency", "200-value-model.create.how", "200-value-model.deliver.activity", "200-value-model.deliver.assumption", "200-value-model.deliver.dependency", "200-value-model.deliver.how", "300-business-model", "300-business-model.capture.inside", "300-business-model.capture.outside", "300-business-model.community.inside", "300-business-model.community.outside", "300-business-model.create.inside", "300-business-model.create.outside", "300-business-model.deliver.inside", "300-business-model.deliver.outside", "300-business-model.support.inside", "300-business-model.support.outside", "300-entity-and-purpose", "300-finance-model", "300-growth-engine", "300-growth-engine.today.commercial", "300-growth-engine.today.cultural", "300-growth-engine.tomorrow.commercial", "300-growth-engine.tomorrow.cultural", "300-value-and-exchange", "300-value-and-exchange.cultural.beneficiary", "300-value-and-exchange.cultural.comes_back", "300-value-and-exchange.cultural.outcome", "300-value-and-exchange.cultural.we_give", "300-value-and-exchange.economic.beneficiary", "300-value-and-exchange.economic.comes_back", "300-value-and-exchange.economic.outcome", "300-value-and-exchange.economic.we_give", "300-value-and-exchange.societal.beneficiary", "300-value-and-exchange.societal.comes_back", "300-value-and-exchange.societal.outcome", "300-value-and-exchange.societal.we_give", "300-vision-and-intent", "400-customer-avatar", "400-customer-avatar.deciders.entry", "400-customer-avatar.deciders.evidence", "400-customer-avatar.gains.entry", "400-customer-avatar.gains.evidence", "400-customer-avatar.job.entry", "400-customer-avatar.job.evidence", "400-customer-avatar.pains.entry", "400-customer-avatar.pains.evidence", "400-customer-avatar.promise.entry", "400-customer-avatar.promise.evidence", "400-customer-avatar.situation.entry", "400-customer-avatar.situation.evidence", "400-five-propositions", "400-five-propositions.customer.statement", "400-five-propositions.customer.support", "400-five-propositions.partner.statement", "400-five-propositions.partner.support", "400-five-propositions.positioning.statement", "400-five-propositions.positioning.support", "400-five-propositions.product.statement", "400-five-propositions.product.support", "400-five-propositions.value.statement", "400-five-propositions.value.support", "400-partner-proposition", "400-positioning", "400-positioning.market.backing", "400-positioning.market.choice", "400-positioning.price.backing", "400-positioning.price.choice", "400-positioning.product.backing", "400-positioning.product.choice", "400-positioning.service.backing", "400-positioning.service.choice", "400-value-proposition", "500-capability-constraint", "500-commercial-assets", "500-commercial-assets.customer_relationships.control", "500-commercial-assets.customer_relationships.recognition", "500-commercial-assets.customer_relationships.what", "500-commercial-assets.equipment_and_cash.control", "500-commercial-assets.equipment_and_cash.recognition", "500-commercial-assets.equipment_and_cash.what", "500-commercial-assets.knowledge.control", "500-commercial-assets.knowledge.recognition", "500-commercial-assets.knowledge.what", "500-commercial-assets.rights_and_licences.control", "500-commercial-assets.rights_and_licences.recognition", "500-commercial-assets.rights_and_licences.what", "500-commercial-assets.software_you_built.control", "500-commercial-assets.software_you_built.recognition", "500-commercial-assets.software_you_built.what", "500-internal-audit-finding", "500-relationship-assets", "500-relationship-assets.communications.effect", "500-relationship-assets.communications.observed", "500-relationship-assets.culture.effect", "500-relationship-assets.culture.observed", "500-relationship-assets.leadership.effect", "500-relationship-assets.leadership.observed", "500-relationship-assets.talent.effect", "500-relationship-assets.talent.observed", "500-revenue-engine", "500-revenue-engine.client_services.weak_handover", "500-revenue-engine.client_services.who", "500-revenue-engine.marketing.weak_handover", "500-revenue-engine.marketing.who", "500-revenue-engine.production.weak_handover", "500-revenue-engine.production.who", "500-revenue-engine.sales.weak_handover", "500-revenue-engine.sales.who", "600-connected-response", "600-funding-need", "600-funding-routes", "600-funding-routes.current_resources.commitments", "600-funding-routes.current_resources.realistic", "600-funding-routes.current_resources.what_it_funds", "600-funding-routes.investment.commitments", "600-funding-routes.investment.realistic", "600-funding-routes.investment.what_it_funds", "600-funding-routes.loan.commitments", "600-funding-routes.loan.realistic", "600-funding-routes.loan.what_it_funds", "600-funding-routes.public.commitments", "600-funding-routes.public.realistic", "600-funding-routes.public.what_it_funds", "600-pestle-scan", "600-pestle-scan.economic.decision", "600-pestle-scan.economic.observation", "600-pestle-scan.environmental.decision", "600-pestle-scan.environmental.observation", "600-pestle-scan.legal.decision", "600-pestle-scan.legal.observation", "600-pestle-scan.political.decision", "600-pestle-scan.political.observation", "600-pestle-scan.social.decision", "600-pestle-scan.social.observation", "600-pestle-scan.technological.decision", "600-pestle-scan.technological.observation", "600-relationship-map", "600-relationship-map.community.influence", "600-relationship-map.community.needs", "600-relationship-map.community.who", "600-relationship-map.contributors.influence", "600-relationship-map.contributors.needs", "600-relationship-map.contributors.who", "600-relationship-map.funders.influence", "600-relationship-map.funders.needs", "600-relationship-map.funders.who", "600-relationship-map.owners.influence", "600-relationship-map.owners.needs", "600-relationship-map.owners.who", "600-relationship-map.partners.influence", "600-relationship-map.partners.needs", "600-relationship-map.partners.who", "600-relationship-map.users.influence", "600-relationship-map.users.needs", "600-relationship-map.users.who", "700-dashboard", "700-dashboard.assets.decision", "700-dashboard.assets.measure", "700-dashboard.assets.owner", "700-dashboard.effectiveness.decision", "700-dashboard.effectiveness.measure", "700-dashboard.effectiveness.owner", "700-dashboard.income.decision", "700-dashboard.income.measure", "700-dashboard.income.owner", "700-dashboard.purpose.decision", "700-dashboard.purpose.measure", "700-dashboard.purpose.owner", "700-development-priorities", "700-implementation-plan", "700-implementation-plan.define.evidence", "700-implementation-plan.define.milestone", "700-implementation-plan.define.owner", "700-implementation-plan.define.work", "700-implementation-plan.deploy.evidence", "700-implementation-plan.deploy.milestone", "700-implementation-plan.deploy.owner", "700-implementation-plan.deploy.work", "700-implementation-plan.design.evidence", "700-implementation-plan.design.milestone", "700-implementation-plan.design.owner", "700-implementation-plan.design.work", "700-implementation-plan.discover.evidence", "700-implementation-plan.discover.milestone", "700-implementation-plan.discover.owner", "700-implementation-plan.discover.work", "700-implementation-plan.review.evidence", "700-implementation-plan.review.milestone", "700-implementation-plan.review.owner", "700-implementation-plan.review.work", "700-playbook-thread", "700-scenarios", "700-scenarios.expected.owner", "700-scenarios.expected.response", "700-scenarios.expected.signal", "700-scenarios.higher.owner", "700-scenarios.higher.response", "700-scenarios.higher.signal", "700-scenarios.lower.owner", "700-scenarios.lower.response", "700-scenarios.lower.signal", "800-conversation-prep", "800-conversation-prep.agenda.listen", "800-conversation-prep.agenda.say", "800-conversation-prep.find.listen", "800-conversation-prep.find.say", "800-conversation-prep.pattern.listen", "800-conversation-prep.pattern.say", "800-conversation-prep.pause.listen", "800-conversation-prep.pause.say", "800-conversation-prep.person.listen", "800-conversation-prep.person.say", "800-conversation-prep.positioning.listen", "800-conversation-prep.positioning.say", "800-conversation-prep.respond.listen", "800-conversation-prep.respond.say", "800-conversation-prep.summary-next.listen", "800-conversation-prep.summary-next.say", "800-conversation-prep.trust.listen", "800-conversation-prep.trust.say", "800-culture-behaviour", "800-founder-journey", "800-leadership-stance", "800-leadership-stance.adaptive-capacity.change", "800-leadership-stance.adaptive-capacity.needed", "800-leadership-stance.adaptive-capacity.now", "800-leadership-stance.cognitive-flexibility.change", "800-leadership-stance.cognitive-flexibility.needed", "800-leadership-stance.cognitive-flexibility.now", "800-leadership-stance.complementary.change", "800-leadership-stance.complementary.needed", "800-leadership-stance.complementary.now", "800-leadership-stance.lead-follow.change", "800-leadership-stance.lead-follow.needed", "800-leadership-stance.lead-follow.now", "800-leadership-stance.orientation.change", "800-leadership-stance.orientation.needed", "800-leadership-stance.orientation.now", "800-leadership-stance.relational-strength.change", "800-leadership-stance.relational-strength.needed", "800-leadership-stance.relational-strength.now", "800-leadership-stance.response.change", "800-leadership-stance.response.needed", "800-leadership-stance.response.now", "800-leadership-stance.self-regulation.change", "800-leadership-stance.self-regulation.needed", "800-leadership-stance.self-regulation.now", "800-playbook-action", "800-situation"]);
