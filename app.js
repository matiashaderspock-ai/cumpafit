const STARTER_EXERCISES = [
  {"id":"curl-inclinado","name":"Incline Dumbbell Curl","group":"Bíceps","equipment":"Banco inclinado · Mancuernas","tile":0,"nameEs":"Curl inclinado con mancuernas","legacyName":"Curl inclinado con mancuernas"},
  {"id":"triceps-pushdown","name":"Rope Triceps Pushdown","group":"Tríceps","equipment":"Polea alta · Cuerda","tile":1,"nameEs":"Extensión de tríceps en polea con cuerda","legacyName":"Tríceps pushdown con cuerda"},
  {"id":"curl-martillo","name":"Dumbbell Hammer Curl","group":"Bíceps","equipment":"Mancuernas","tile":2,"nameEs":"Curl martillo con mancuernas","legacyName":"Curl martillo con mancuernas"},
  {"id":"triceps-overhead","name":"Overhead Cable Triceps Extension","group":"Tríceps","equipment":"Polea · Cuerda","tile":3,"nameEs":"Extensión de tríceps por encima de la cabeza en polea","legacyName":"Extensión de tríceps por encima de la cabeza"},
  {"id":"curl-predicador","name":"Machine Preacher Curl","group":"Bíceps","equipment":"Máquina predicador","tile":4,"nameEs":"Curl predicador en máquina","legacyName":"Curl predicador en máquina"},
  {"id":"fondos-paralelas","name":"Parallel-Bar Dip","group":"Tríceps","equipment":"Paralelas · Peso corporal","tile":5,"nameEs":"Fondos en paralelas","legacyName":"Fondos en paralelas"},
  {"id":"press-pecho-maquina","name":"Machine Chest Press","group":"Pecho","equipment":"Máquina de press de pecho","nameEs":"Press de pecho en máquina","legacyName":"Press de pecho en máquina"},
  {"id":"press-inclinado-mancuernas","name":"Incline Dumbbell Bench Press","group":"Pecho","equipment":"Banco inclinado · Mancuernas","nameEs":"Press de banca inclinado con mancuernas","legacyName":"Press inclinado con mancuernas"},
  {"id":"aperturas-polea","name":"Standing Cable Chest Fly","group":"Pecho","equipment":"Poleas dobles","nameEs":"Aperturas de pecho de pie en polea","legacyName":"Aperturas de pecho en polea"},
  {"id":"jalon-pecho","name":"Lat Pulldown","group":"Espalda","equipment":"Polea alta · Barra","nameEs":"Jalón al pecho","legacyName":"Jalón al pecho en polea"},
  {"id":"remo-sentado-polea","name":"Seated Cable Row","group":"Espalda","equipment":"Polea baja · Agarrador","nameEs":"Remo sentado en polea","legacyName":"Remo sentado en polea"},
  {"id":"remo-mancuerna","name":"One-Arm Dumbbell Row","group":"Espalda","equipment":"Banco plano · Mancuerna","nameEs":"Remo con mancuerna a una mano","legacyName":"Remo con mancuerna a una mano"},
  {"id":"press-hombros-maquina","name":"Machine Shoulder Press","group":"Hombros","equipment":"Máquina de press de hombros","nameEs":"Press de hombros en máquina","legacyName":"Press de hombros en máquina"},
  {"id":"elevaciones-laterales","name":"Dumbbell Lateral Raise","group":"Hombros","equipment":"Mancuernas","nameEs":"Elevaciones laterales con mancuernas","legacyName":"Elevaciones laterales con mancuernas"},
  {"id":"pajaros-mancuernas","name":"Bent-Over Dumbbell Reverse Fly","group":"Hombros","equipment":"Mancuernas","nameEs":"Aperturas inversas con mancuernas con el torso inclinado","legacyName":"Pájaros con mancuernas"},
  {"id":"caminata-cinta","name":"Treadmill Walking","group":"Cardio","equipment":"Cinta de correr","nameEs":"Caminata en cinta","legacyName":"Caminata en cinta"},
  {"id":"bicicleta-estatica","name":"Stationary Cycling","group":"Cardio","equipment":"Bicicleta estática","nameEs":"Ciclismo en bicicleta estática","legacyName":"Bicicleta estática"},
  {"id":"remo-ergometro","name":"Indoor Rowing","group":"Cardio","equipment":"Máquina de remo","nameEs":"Remo en ergómetro","legacyName":"Remo ergómetro"},
  {"id":"crunch-maquina","name":"Machine Abdominal Crunch","group":"Abs","equipment":"Máquina abdominal","nameEs":"Crunch abdominal en máquina","legacyName":"Crunch en máquina"},
  {"id":"plancha-frontal","name":"Forearm Plank","group":"Abs","equipment":"Colchoneta · Peso corporal","nameEs":"Plancha sobre antebrazos","legacyName":"Plancha frontal"},
  {"id":"elevacion-rodillas","name":"Captain’s Chair Knee Raise","group":"Abs","equipment":"Silla romana · Peso corporal","nameEs":"Elevación de rodillas en silla romana","legacyName":"Elevación de rodillas en silla romana"},
  {"id":"pec-deck","name":"Pec Deck Fly","group":"Pecho","equipment":"Máquina pec deck","nameEs":"Aperturas de pecho en máquina pec deck","legacyName":"Pec Deck","legacyEquipment":"Aperturas de pecho en máquina · Pec deck"},
  {"id":"reverse-pec-deck","name":"Reverse Pec Deck","group":"Hombros","equipment":"Máquina pec deck · Deltoides posteriores","nameEs":"Aperturas inversas en máquina pec deck","legacyName":"Reverse Pec Deck","legacyEquipment":"Aperturas inversas en máquina · Deltoides posteriores"},
  {"id":"incline-chest-supported-dumbbell-row","name":"Incline Chest-Supported Dumbbell Row","nameEs":"Remo con mancuernas y pecho apoyado en banco inclinado","group":"Espalda","equipment":"Banco inclinado · Mancuernas"},
  {"id":"single-arm-seated-cable-row","name":"Single-Arm Seated Cable Row","nameEs":"Remo unilateral sentado en polea baja","group":"Espalda","equipment":"Polea baja · Asa individual · Banco"},
  {"id":"remo-maquina-pecho-apoyado","name":"Chest-Supported Machine Row","group":"Espalda","equipment":"Máquina de remo · Apoyo de pecho","nameEs":"Remo en máquina con apoyo de pecho","legacyName":"Chest-Supported Machine Row","legacyEquipment":"Remo sentado en máquina · Apoyo de pecho"},
  {"id":"straight-arm-pulldown","name":"Straight-Arm Cable Pulldown","group":"Espalda","equipment":"Polea alta · Barra recta","nameEs":"Jalón en polea con brazos rectos","legacyName":"Straight-Arm Cable Pulldown","legacyEquipment":"Pullover de pie en polea alta · Barra recta"},
  {"id":"standing-dumbbell-curl","name":"Standing Dumbbell Curl","group":"Bíceps","equipment":"Mancuernas","nameEs":"Curl de bíceps de pie con mancuernas","legacyName":"Standing Dumbbell Curl","legacyEquipment":"Curl de bíceps de pie · Mancuernas"},
  {"id":"standing-barbell-curl","name":"Standing Barbell Curl","group":"Bíceps","equipment":"Barra recta","nameEs":"Curl de bíceps de pie con barra","legacyName":"Standing Barbell Curl","legacyEquipment":"Curl de bíceps de pie · Barra recta"},
  {"id":"ez-bar-preacher-curl","name":"EZ-Bar Preacher Curl","group":"Bíceps","equipment":"Banco Scott · Barra EZ","nameEs":"Curl predicador con barra EZ","legacyName":"EZ-Bar Preacher Curl","legacyEquipment":"Curl predicador · Banco Scott · Barra EZ"},
  {"id":"plate-front-raise","name":"Plate Front Raise","group":"Hombros","equipment":"Disco","nameEs":"Elevación frontal con disco","legacyName":"Plate Front Raise","legacyEquipment":"Elevación frontal · Disco"},
  {"id":"dumbbell-front-raise","name":"Dumbbell Front Raise","group":"Hombros","equipment":"Mancuernas","nameEs":"Elevación frontal con mancuernas","legacyName":"Dumbbell Front Raise","legacyEquipment":"Elevación frontal · Mancuernas"},
  {"id":"prone-leg-curl","name":"Prone Leg Curl","group":"Piernas","equipment":"Máquina Technogym","nameEs":"Curl femoral tumbado","legacyName":"Prone Leg Curl","legacyEquipment":"Curl femoral tumbado · Máquina Technogym"},
  {"id":"seated-leg-curl","name":"Seated Leg Curl","group":"Piernas","equipment":"Máquina Technogym","nameEs":"Curl femoral sentado","legacyName":"Seated Leg Curl","legacyEquipment":"Curl femoral sentado · Máquina Technogym"},
  {"id":"leg-press","name":"Leg Press","group":"Piernas","equipment":"Máquina Technogym","nameEs":"Prensa de piernas","legacyName":"Leg Press","legacyEquipment":"Prensa de piernas · Máquina Technogym"},
  {"id":"machine-lateral-raise","name":"Machine Lateral Raise","group":"Hombros","equipment":"Máquina con apoyos para codos","nameEs":"Elevación lateral en máquina","legacyName":"Machine Lateral Raise","legacyEquipment":"Elevación lateral sentada · Máquina con apoyos para codos"},
  {"id":"leg-extension","name":"Leg Extension","group":"Piernas","equipment":"Máquina Technogym","nameEs":"Extensión de piernas","legacyName":"Leg Extension","legacyEquipment":"Extensión de piernas · Máquina Technogym"},
  {"id":"machine-triceps-extension","name":"Seated Machine Triceps Extension","group":"Tríceps","equipment":"Máquina de palancas","nameEs":"Extensión de tríceps sentado en máquina","legacyName":"Seated Machine Triceps Extension","legacyEquipment":"Extensión de tríceps sentada · Máquina de palancas"},
  {"id":"hip-abduction-machine","name":"Machine Hip Abduction","group":"Glúteos","equipment":"Máquina abductora","nameEs":"Abducción de cadera en máquina","legacyName":"Machine Hip Abduction","legacyEquipment":"Abducción de cadera · Máquina abductora · Abrir piernas"},
  {"id":"hip-adduction-machine","name":"Machine Hip Adduction","group":"Piernas","equipment":"Máquina aductora","nameEs":"Aducción de cadera en máquina","legacyName":"Machine Hip Adduction","legacyEquipment":"Aducción de cadera · Máquina aductora · Cerrar piernas"},
  {"id":"ski-ergometer","name":"Ski Ergometer","group":"Cardio","equipment":"Technogym Skillup","nameEs":"Ergómetro de esquí","legacyName":"Ski Ergometer","legacyEquipment":"Ergómetro de esquí · Technogym Skillup"},
  {"id":"skillmill-walking-running","name":"Curved Treadmill Walking / Running","group":"Cardio","equipment":"Cinta curva autopropulsada · Technogym Skillmill","nameEs":"Caminata o carrera en cinta curva","legacyName":"Curved Treadmill Walking / Running","legacyEquipment":"Caminata o carrera en cinta curva autopropulsada · Technogym Skillmill"},
  {"id":"wide-machine-chest-press","name":"Wide Machine Chest Press","group":"Pecho","equipment":"Technogym Pure Strength Wide Chest Press","nameEs":"Press de pecho amplio en máquina","legacyName":"Wide Machine Chest Press","legacyEquipment":"Press de pecho amplio · Technogym Pure Strength Wide Chest Press"},
  {"id":"smith-machine-squat","name":"Smith Machine Squat","group":"Piernas","equipment":"Technogym Multipower · Smith","nameEs":"Sentadilla en máquina Smith","legacyName":"Smith Machine Squat","legacyEquipment":"Sentadilla con barra guiada · Technogym Multipower · Smith"},
  {"id":"wall-ball","name":"Wall Ball Throw","group":"Otros","equipment":"Balón medicinal · Zona de wall ball","nameEs":"Lanzamiento de balón medicinal a la pared","legacyName":"Wall Ball Throw","legacyEquipment":"Lanzamiento de balón medicinal a la pared · Zona de wall ball"},
  {"id":"barbell-bench-press","name":"Barbell Bench Press","group":"Pecho","equipment":"Banco olímpico plano · Barra","nameEs":"Press de banca con barra","legacyName":"Barbell Bench Press","legacyEquipment":"Press de banca plano · Banco olímpico · Barra"},
  {"id":"incline-barbell-bench-press","name":"Incline Barbell Bench Press","group":"Pecho","equipment":"Banco olímpico inclinado · Barra","nameEs":"Press de banca inclinado con barra","legacyName":"Incline Barbell Bench Press","legacyEquipment":"Press de banca inclinado · Banco olímpico inclinado · Barra"},
  {"id":"back-extension-45","name":"45-Degree Back Extension","group":"Espalda","equipment":"Banco a 45° con apoyo de cadera y tobillos","nameEs":"Extensión de espalda a 45 grados","legacyName":"45-Degree Back Extension","legacyEquipment":"Extensión lumbar · Banco a 45° con apoyo de cadera y tobillos"},
  {"id":"machine-hip-thrust","name":"Machine Hip Thrust","group":"Glúteos","equipment":"Máquina dedicada de hip thrust con discos","nameEs":"Empuje de cadera en máquina","legacyName":"Machine Hip Thrust","legacyEquipment":"Empuje de cadera · Máquina dedicada de hip thrust con discos"},
  {"id":"pull-up","name":"Pull-Up","group":"Espalda","equipment":"Barra multiagarre superior · Cable Station 5 · Peso corporal","nameEs":"Dominadas","legacyName":"Pull-Up","legacyEquipment":"Dominadas · Barra multiagarre superior · Cable Station 5 · Peso corporal"},
  {"id":"machine-curl-individual-elbow-pads","name":"Machine Biceps Curl — Individual Elbow Pads","group":"Bíceps","equipment":"Máquina con apoyo individual para cada codo","nameEs":"Curl de bíceps en máquina con apoyos individuales para los codos","legacyName":"Machine Biceps Curl — Individual Elbow Pads","legacyEquipment":"Curl de bíceps en máquina · Apoyo individual para cada codo"},
  {"id":"push-up","name":"Push-Up","nameEs":"Flexiones de brazos (lagartijas)","group":"Pecho","equipment":"Peso corporal · Suelo"},
  {"id":"dumbbell-fly","name":"Dumbbell Fly","nameEs":"Aperturas de pecho con mancuernas en banco plano","group":"Pecho","equipment":"Banco plano · Mancuernas"},
  {"id":"dumbbell-bench-press","name":"Dumbbell Bench Press","nameEs":"Press de banca plano con mancuernas","group":"Pecho","equipment":"Banco plano · Mancuernas"},
  {"id":"high-to-low-cable-fly","name":"High-to-Low Cable Fly","nameEs":"Aperturas de pecho en polea de arriba hacia abajo","group":"Pecho","equipment":"Poleas altas · Agarradores individuales"},
  {"id":"low-to-high-cable-fly","name":"Low-to-High Cable Fly","nameEs":"Aperturas de pecho en polea de abajo hacia arriba","group":"Pecho","equipment":"Poleas bajas · Agarradores individuales"},
  {"id":"single-arm-cable-chest-fly","name":"Single-Arm Cable Chest Fly","nameEs":"Apertura de pecho en polea a un brazo","group":"Pecho","equipment":"Polea a la altura del pecho · Agarrador individual"},
  {"id":"chest-dip","name":"Chest Dip","nameEs":"Fondos en paralelas con énfasis en pecho","group":"Pecho","equipment":"Paralelas · Peso corporal · Torso inclinado hacia delante"},
  {"id":"close-grip-lat-pulldown","name":"Close-Grip Lat Pulldown","nameEs":"Jalón al pecho con agarre cerrado neutro","group":"Espalda","equipment":"Polea alta · Agarrador en V"},
  {"id":"narrow-grip-barbell-row","name":"Narrow-Grip Bent-Over Barbell Row","nameEs":"Remo inclinado con barra y agarre cerrado prono","group":"Espalda","equipment":"Barra · Discos"},
  {"id":"wide-grip-barbell-row","name":"Wide-Grip Bent-Over Barbell Row","nameEs":"Remo inclinado con barra y agarre abierto prono","group":"Espalda","equipment":"Barra · Discos"},
  {"id":"cable-rope-face-pull","name":"Cable Rope Face Pull","nameEs":"Jalón de cuerda hacia la cara en polea","group":"Hombros","equipment":"Polea alta · Cuerda"},
  {"id":"standing-cable-curl","name":"Standing Cable Curl","nameEs":"Curl de bíceps de pie en polea baja","group":"Bíceps","equipment":"Polea baja · Barra recta o EZ"},
  {"id":"single-arm-dumbbell-preacher-curl","name":"Single-Arm Dumbbell Preacher Curl","nameEs":"Curl predicador con mancuerna a un brazo","group":"Bíceps","equipment":"Banco Scott · Mancuerna"},
  {"id":"dumbbell-concentration-curl","name":"Dumbbell Concentration Curl","nameEs":"Curl concentrado con mancuerna","group":"Bíceps","equipment":"Mancuerna · Banco"},
  {"id":"standing-ez-bar-curl","name":"Standing EZ-Bar Curl","nameEs":"Curl de pie con barra Z","group":"Bíceps","equipment":"Barra Z"},
  {"id":"close-grip-barbell-bench-press","name":"Close-Grip Barbell Bench Press","nameEs":"Press de banca con barra y agarre cerrado","group":"Tríceps","equipment":"Barra · Banco plano"},
  {"id":"lying-dumbbell-triceps-extension","name":"Lying Dumbbell Triceps Extension","nameEs":"Extensión de tríceps acostado con mancuernas","group":"Tríceps","equipment":"Mancuernas · Banco plano"},
  {"id":"overhead-dumbbell-triceps-extension","name":"Overhead Dumbbell Triceps Extension","nameEs":"Extensión de tríceps por encima de la cabeza con mancuerna","group":"Tríceps","equipment":"Mancuerna · Banco"},
  {"id":"straight-bar-triceps-pushdown","name":"Straight-Bar Triceps Pushdown","nameEs":"Extensión de tríceps en polea con barra recta","group":"Tríceps","equipment":"Polea alta · Barra recta"},
  {"id":"incline-dumbbell-fly","name":"Incline Dumbbell Fly","nameEs":"Aperturas con mancuernas en banco inclinado","group":"Pecho","equipment":"Mancuernas · Banco inclinado"},
  {"id":"chin-up","name":"Chin-Up","nameEs":"Dominada con agarre supino","group":"Espalda","equipment":"Barra de dominadas"},
  {"id":"inverted-row","name":"Inverted Row","nameEs":"Remo invertido","group":"Espalda","equipment":"Barra horizontal baja · Smith"},
  {"id":"conventional-barbell-deadlift","name":"Conventional Barbell Deadlift","nameEs":"Peso muerto convencional con barra","group":"Espalda","equipment":"Barra · Discos"},
  {"id":"dumbbell-shrug","name":"Dumbbell Shrug","nameEs":"Encogimiento de hombros con mancuernas","group":"Espalda","equipment":"Mancuernas"},
  {"id":"seated-dumbbell-shoulder-press","name":"Seated Dumbbell Shoulder Press","nameEs":"Press de hombros sentado con mancuernas","group":"Hombros","equipment":"Mancuernas · Banco con respaldo"},
  {"id":"standing-barbell-overhead-press","name":"Standing Barbell Overhead Press","nameEs":"Press militar de pie con barra","group":"Hombros","equipment":"Barra"},
  {"id":"single-arm-cable-lateral-raise","name":"Single-Arm Cable Lateral Raise","nameEs":"Elevación lateral unilateral en polea","group":"Hombros","equipment":"Polea baja · Asa individual"},
  {"id":"side-plank","name":"Side Plank","nameEs":"Plancha lateral","group":"Abs","equipment":"Colchoneta"},
  {"id":"reverse-crunch","name":"Reverse Crunch","nameEs":"Crunch inverso","group":"Abs","equipment":"Colchoneta"},
  {"id":"hanging-leg-raise","name":"Hanging Leg Raise","nameEs":"Elevación de piernas colgado","group":"Abs","equipment":"Barra de dominadas"},
  {"id":"jump-rope","name":"Jump Rope","nameEs":"Salto de cuerda","group":"Cardio","equipment":"Cuerda para saltar"},
  {"id":"dumbbell-wrist-curl","name":"Dumbbell Wrist Curl","nameEs":"Curl de muñecas con mancuernas","group":"Otros","equipment":"Mancuernas · Banco"},
  {"id":"dumbbell-reverse-wrist-curl","name":"Dumbbell Reverse Wrist Curl","nameEs":"Extensión de muñecas con mancuernas","group":"Otros","equipment":"Mancuernas · Banco"},
  {"id":"standing-ez-bar-machine-curl","name":"Standing EZ-Bar Machine Curl","group":"Bíceps","equipment":"Panatta · Máquina de pesas con selector","nameEs":"Curl de bíceps de pie en máquina con barra EZ"},
];
const STARTER_ILLUSTRATIONS = {
  "standing-ez-bar-machine-curl": "./assets/standing-ez-bar-machine-curl.png",
  "curl-inclinado": "./assets/curl-inclinado-hd.jpg",
  "triceps-pushdown": "./assets/triceps-pushdown-hd.jpg",
  "curl-martillo": "./assets/curl-martillo-hd.jpg",
  "triceps-overhead": "./assets/triceps-overhead-hd.jpg",
  "curl-predicador": "./assets/curl-predicador-hd.jpg",
  "fondos-paralelas": "./assets/fondos-paralelas-hd.jpg",
  "press-pecho-maquina": "./assets/press-pecho-maquina.jpg",
  "press-inclinado-mancuernas": "./assets/press-inclinado-mancuernas.jpg",
  "aperturas-polea": "./assets/aperturas-polea.jpg",
  "jalon-pecho": "./assets/jalon-pecho-v2.jpg",
  "remo-sentado-polea": "./assets/remo-sentado-polea.jpg",
  "remo-mancuerna": "./assets/remo-mancuerna.jpg",
  "press-hombros-maquina": "./assets/press-hombros-maquina.jpg",
  "elevaciones-laterales": "./assets/elevaciones-laterales.jpg",
  "pajaros-mancuernas": "./assets/pajaros-mancuernas.jpg",
  "caminata-cinta": "./assets/caminata-cinta.jpg",
  "bicicleta-estatica": "./assets/bicicleta-estatica.jpg",
  "remo-ergometro": "./assets/remo-ergometro.jpg",
  "crunch-maquina": "./assets/crunch-maquina.jpg",
  "plancha-frontal": "./assets/plancha-frontal.jpg",
  "elevacion-rodillas": "./assets/elevacion-rodillas.jpg",
  "pec-deck": "./assets/pec-deck.jpg",
  "reverse-pec-deck": "./assets/reverse-pec-deck.jpg",
  "incline-chest-supported-dumbbell-row": "./assets/remo-mancuernas-pecho-apoyado.svg",
  "single-arm-seated-cable-row": "./assets/remo-unilateral-polea.svg",
  "remo-maquina-pecho-apoyado": "./assets/remo-maquina-pecho-apoyado.jpg",
  "straight-arm-pulldown": "./assets/straight-arm-pulldown.jpg",
  "standing-dumbbell-curl": "./assets/standing-dumbbell-curl.jpg",
  "standing-barbell-curl": "./assets/standing-barbell-curl.jpg",
  "ez-bar-preacher-curl": "./assets/ez-bar-preacher-curl.jpg",
  "plate-front-raise": "./assets/plate-front-raise.jpg",
  "dumbbell-front-raise": "./assets/dumbbell-front-raise.jpg",
  "prone-leg-curl": "./assets/prone-leg-curl.jpg",
  "seated-leg-curl": "./assets/seated-leg-curl-v3.jpg",
  "leg-press": "./assets/leg-press-v2.jpg",
  "machine-lateral-raise": "./assets/machine-lateral-raise.jpg",
  "leg-extension": "./assets/leg-extension.jpg",
  "machine-triceps-extension": "./assets/machine-triceps-extension.jpg",
  "hip-abduction-machine": "./assets/hip-abduction-machine-v2.jpg",
  "hip-adduction-machine": "./assets/hip-adduction-machine.jpg",
  "ski-ergometer": "./assets/ski-ergometer.jpg",
  "skillmill-walking-running": "./assets/skillmill-walking-running.jpg",
  "wide-machine-chest-press": "./assets/wide-machine-chest-press.jpg",
  "smith-machine-squat": "./assets/smith-machine-squat-v2.jpg",
  "wall-ball": "./assets/wall-ball.jpg",
  "barbell-bench-press": "./assets/barbell-bench-press-v2.jpg",
  "incline-barbell-bench-press": "./assets/incline-barbell-bench-press-v2.jpg",
  "back-extension-45": "./assets/back-extension-45.jpg",
  "machine-hip-thrust": "./assets/machine-hip-thrust.jpg",
  "pull-up": "./assets/pull-up.jpg",
  "machine-curl-individual-elbow-pads": "./assets/machine-curl-individual-elbow-pads.jpg",
  "push-up": "./assets/push-up.jpg",
  "dumbbell-fly": "./assets/dumbbell-fly.jpg",
  "dumbbell-bench-press": "./assets/dumbbell-bench-press.jpg",
  "high-to-low-cable-fly": "./assets/high-to-low-cable-fly.jpg",
  "low-to-high-cable-fly": "./assets/low-to-high-cable-fly.jpg",
  "single-arm-cable-chest-fly": "./assets/single-arm-cable-chest-fly-v2.jpg",
  "chest-dip": "./assets/chest-dip.jpg",
  "close-grip-lat-pulldown": "./assets/close-grip-lat-pulldown.jpg",
  "narrow-grip-barbell-row": "./assets/narrow-grip-barbell-row.jpg",
  "wide-grip-barbell-row": "./assets/wide-grip-barbell-row.jpg",
  "cable-rope-face-pull": "./assets/cable-rope-face-pull.jpg",
  "standing-cable-curl": "./assets/standing-cable-curl.jpg",
  "single-arm-dumbbell-preacher-curl": "./assets/single-arm-dumbbell-preacher-curl.jpg",
  "dumbbell-concentration-curl": "./assets/dumbbell-concentration-curl.jpg",
  "standing-ez-bar-curl": "./assets/standing-ez-bar-curl.jpg",
  "close-grip-barbell-bench-press": "./assets/close-grip-barbell-bench-press.jpg",
  "lying-dumbbell-triceps-extension": "./assets/lying-dumbbell-triceps-extension.jpg",
  "overhead-dumbbell-triceps-extension": "./assets/overhead-dumbbell-triceps-extension.jpg",
  "straight-bar-triceps-pushdown": "./assets/straight-bar-triceps-pushdown.jpg",
  "incline-dumbbell-fly": "./assets/incline-dumbbell-fly.jpg",
  "chin-up": "./assets/chin-up.jpg",
  "inverted-row": "./assets/inverted-row.jpg",
  "conventional-barbell-deadlift": "./assets/conventional-barbell-deadlift.jpg",
  "dumbbell-shrug": "./assets/dumbbell-shrug.jpg",
  "seated-dumbbell-shoulder-press": "./assets/seated-dumbbell-shoulder-press.jpg",
  "standing-barbell-overhead-press": "./assets/standing-barbell-overhead-press.jpg",
  "single-arm-cable-lateral-raise": "./assets/single-arm-cable-lateral-raise.jpg",
  "side-plank": "./assets/side-plank.jpg",
  "reverse-crunch": "./assets/reverse-crunch.jpg",
  "hanging-leg-raise": "./assets/hanging-leg-raise.jpg",
  "jump-rope": "./assets/jump-rope.jpg",
  "dumbbell-wrist-curl": "./assets/dumbbell-wrist-curl.jpg",
  "dumbbell-reverse-wrist-curl": "./assets/dumbbell-reverse-wrist-curl.jpg"
};
const GROUPS = ["Bíceps", "Tríceps", "Pecho", "Espalda", "Hombros", "Cardio", "Abs", "Piernas", "Glúteos", "Core", "Otros"];

const DB_NAME = "cumpafit";
const DB_VERSION = 1;
const STORE = "data";
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const todayISO = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const formatDate = iso => new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`));
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const initialState = () => ({ version: 1, exercises: structuredClone(STARTER_EXERCISES), sessions: {}, routines: [] });
function mergeStarterExercises(snapshot) {
  const existingIds = new Set(snapshot.exercises.map(ex => ex.id));
  const missing = STARTER_EXERCISES.filter(ex => !existingIds.has(ex.id));
  snapshot.exercises.push(...structuredClone(missing));
  return missing.length;
}
function migrateExerciseNames(snapshot) {
  let changed = 0;
  for (const ex of snapshot.exercises) {
    const starter = STARTER_EXERCISES.find(item => item.id === ex.id);
    if (!starter) continue;
    if (starter.legacyEquipment && ex.equipment === starter.legacyEquipment && ex.equipment !== starter.equipment) {
      ex.equipment = starter.equipment;
      changed++;
    }
    if (ex.name === starter.legacyName && ex.name !== starter.name) {
      ex.name = starter.name;
      changed++;
    }
    // Leave user-written translations and custom exercise names intact.
    if (ex.nameEs === undefined && ex.name === starter.name) {
      ex.nameEs = starter.nameEs;
      changed++;
    }
  }
  return changed;
}
const normalizeSearch = value => String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es");
const exerciseMatches = (ex, query) => normalizeSearch(`${ex.name} ${ex.nameEs || ""} ${ex.equipment} ${ex.group}`).includes(normalizeSearch(query));
const favoritesFirst = exercises => exercises.slice().sort((a, b) => Number(b.favorite === true) - Number(a.favorite === true));
function favoriteButton(ex) {
  return `<button type="button" class="favorite-button${ex.favorite ? " is-favorite" : ""}" data-action="toggle-favorite" data-id="${escapeHtml(ex.id)}" aria-pressed="${ex.favorite === true}" aria-label="${ex.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}: ${escapeHtml(ex.name)}"><svg class="favorite-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91L12 3Z"/></svg></button>`;
}
async function toggleExerciseFavorite(id) {
  const ex = getExercise(id);
  if (!ex) return false;
  const hadFavorite = Object.hasOwn(ex, "favorite");
  const before = ex.favorite;
  ex.favorite = ex.favorite !== true;
  try { await persistNow(); } catch {
    if (hadFavorite) ex.favorite = before; else delete ex.favorite;
    showToast("No se pudo guardar el favorito");
    return false;
  }
  render();
  showToast(ex.favorite ? "Favorito guardado · aparece primero en su categoría" : "Ejercicio quitado de favoritos");
  return true;
}

let db;
let state;
let tab = "today";
let activeDate = todayISO();
let observedToday = activeDate;
let expandedId = STARTER_EXERCISES[0].id;
let catalogFilter = "Todos";
let catalogSearch = "";
let saveTimer;
let saveChain = Promise.resolve();
let toastTimer;
let undoAction;
const sessionHistoryOpen = new Set();
const catalogDetailsOpen = new Set();
let routineDraft;
let historyMonth = activeDate.slice(0, 7);

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function readState() {
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get("main");
    request.onsuccess = () => resolve(request.result || initialState());
    request.onerror = () => reject(request.error);
  });
}
function writeState(snapshot) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    transaction.objectStore(STORE).put(snapshot, "main");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("Guardado interrumpido"));
  });
}
async function persistNow() {
  clearTimeout(saveTimer);
  const snapshot = structuredClone(state);
  const write = saveChain.then(() => writeState(snapshot));
  saveChain = write.catch(error => { console.error(error); });
  await write;
}
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const snapshot = structuredClone(state);
    saveChain = saveChain.then(() => writeState(snapshot)).catch(error => { console.error(error); showToast("No se pudo guardar el registro"); });
  }, 120);
}
function ensureSession(date = activeDate) {
  if (state.sessions[date]) return state.sessions[date];
  state.sessions[date] = { date, selected: [], completed: {}, sets: {} };
  persist();
  return state.sessions[date];
}
function syncSessionDay() {
  if (!state) return false;
  const today = todayISO();
  if (today === observedToday) return false;
  const wasViewingToday = activeDate === observedToday;
  observedToday = today;
  // Keep explicitly opened historical dates available for review and correction.
  if (wasViewingToday) {
    activeDate = today;
    expandedId = "";
    closeOverlay();
  }
  render();
  return wasViewingToday;
}
function getExercise(id) { return state.exercises.find(ex => ex.id === id); }
// Keep legacy distances intact; derive average speed only when no speed was saved.
function usesSpeed(ex) {
  return ex?.group === "Cardio" &&
    (["caminata-cinta", "skillmill-walking-running"].includes(ex.id) ||
      /\b(walk(?:ing)?|jog(?:ging)?|run(?:ning)?|caminata|caminar|trote|trotar|corrida|correr|carrera)\b/i.test(`${ex.name || ""} ${ex.nameEs || ""} ${ex.legacyName || ""}`));
}
function cardioMetric(ex) {
  return usesSpeed(ex)
    ? { field: "speedKmh", label: "Velocidad km/h", heading: "Vel. km/h", unit: "km/h" }
    : { field: "distanceKm", label: "Distancia km", heading: "Dist. km", unit: "km" };
}
function cardioValue(ex, set) {
  if (!usesSpeed(ex)) return set.distanceKm;
  if (Object.hasOwn(set, "speedKmh")) return set.speedKmh;
  const minutes = decimalNumber(set.minutes), distance = decimalNumber(set.distanceKm);
  return minutes > 0 && Number.isFinite(distance) && distance >= 0 && String(set.distanceKm ?? "").trim() !== ""
    ? String(Math.round(distance * 60 / minutes * 100) / 100) : "";
}
function validCardioSet(ex, set) {
  const minutes = decimalNumber(set.minutes), value = decimalNumber(cardioValue(ex, set));
  return Number.isFinite(minutes) && minutes > 0 && Number.isFinite(value) && value >= 0;
}
function newSetFor(ex, previous = {}) {
  const set = ex?.group === "Cardio"
    ? { id: uid(), minutes: previous.minutes || "", [cardioMetric(ex).field]: cardioValue(ex, previous) || "", done: false }
    : { id: uid(), kg: previous.kg || "", reps: previous.reps || "", done: false, autoDone: false };
  if ([set.kg, set.reps, set.minutes, set.distanceKm, set.speedKmh].some(value => String(value ?? "").trim() !== "")) set.prefilled = true;
  return set;
}
function updateAutoDone(set) {
  // A deliberate checkbox choice survives later edits and reopening the app.
  if (set.manualDone === true) return false;
  const kg = decimalNumber(set.kg);
  const reps = Number(set.reps);
  const valid = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(String(set.kg ?? "").trim()) &&
    Number.isFinite(kg) && kg > 0 && /^\d+$/.test(String(set.reps ?? "").trim()) &&
    Number.isInteger(reps) && reps > 0;
  const before = set.done;
  if (valid && !set.done) { set.done = true; set.autoDone = true; }
  else if (!valid && set.autoDone === true) { set.done = false; set.autoDone = false; }
  return before !== set.done;
}
function decimalNumber(value) {
  const raw = String(value ?? "").trim().replace(",", ".");
  return raw === "" ? 0 : Number(raw);
}
function isExerciseComplete(session, id) {
  if (Object.hasOwn(session.completed, id)) return session.completed[id];
  const sets = session.sets[id] || [];
  return sets.length > 0 && sets.every(set => set.done);
}
function imageMarkup(ex, className = "exercise-image") {
  const source = ex.image || STARTER_ILLUSTRATIONS[ex.id];
  if (source) return `<img class="${className}${ex.image ? "" : " starter-illustration"}" src="${escapeHtml(source)}" alt="Ilustración de ${escapeHtml(ex.name)}" />`;
  if (!Number.isInteger(ex.tile)) return `<div class="${className} image-pending" role="img" aria-label="Imagen pendiente de ${escapeHtml(ex.name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/></svg><span>Imagen pendiente</span></div>`;
  return `<div class="${className} tile-image tile-${ex.tile}" role="img" aria-label="Ilustración de ${escapeHtml(ex.name)}"></div>`;
}
function catalogImageButton(ex) {
  if (!ex.image && !STARTER_ILLUSTRATIONS[ex.id] && !Number.isInteger(ex.tile)) return imageMarkup(ex, "catalog-image");
  return `<button type="button" class="catalog-image-button" data-action="view-image" data-id="${escapeHtml(ex.id)}" aria-label="Ver ilustración completa de ${escapeHtml(ex.name)}">${imageMarkup(ex, "catalog-image")}<span class="zoom-cue" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></span></button>`;
}
function lastPerformance(id, beforeDate = activeDate) {
  const cardio = getExercise(id)?.group === "Cardio";
  const dates = Object.keys(state.sessions).filter(date => date < beforeDate).sort().reverse();
  for (const date of dates) {
    const sets = state.sessions[date].sets[id] || [];
    if (cardio) {
      const done = sets.filter(set => set.done && decimalNumber(set.minutes) > 0);
      if (done.length) {
        const last = done.at(-1);
        const minutes = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(decimalNumber(last.minutes));
        const distance = decimalNumber(cardioValue(getExercise(id), last));
        return `${date.slice(8, 10)}/${date.slice(5, 7)} · ${minutes} min${distance > 0 ? ` · ${new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(distance)} ${cardioMetric(getExercise(id)).unit}` : ""}`;
      }
      continue;
    }
    const done = sets.filter(set => set.done && !set.dropSet && Number(set.reps) > 0);
    if (done.length) {
      const best = done.at(-1);
      return `${date.slice(8, 10)}/${date.slice(5, 7)} · ${best.reps} reps${best.kg !== "" ? ` · ${best.kg} kg` : " · peso corporal"}`;
    }
  }
  return "Sin registros anteriores";
}
function recordedUses(id, beforeDate = `${todayISO()}~`) {
  const cardio = getExercise(id)?.group === "Cardio";
  return Object.keys(state.sessions).filter(date => date < beforeDate).sort().map(date => {
    const sets = (state.sessions[date].sets?.[id] || []).filter(set => {
      if (!set.done) return false;
      if (cardio) return validCardioSet(getExercise(id), set);
      return Number.isInteger(Number(set.reps)) && Number(set.reps) > 0 && Number.isFinite(decimalNumber(set.kg)) && decimalNumber(set.kg) >= 0;
    });
    return { date, sets, maxKg: cardio || !sets.length ? null : Math.max(...sets.map(set => decimalNumber(set.kg))) };
  }).filter(use => use.sets.length);
}
function lastRegularSet(id, beforeDate = activeDate) {
  for (const use of recordedUses(id, beforeDate).reverse()) {
    const set = use.sets.filter(set => !set.dropSet).at(-1);
    if (set) return set;
  }
}
const shortUseDate = date => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const formatMeasure = value => new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(decimalNumber(value));
function widgetToggleIcon(expanded = false) {
  const path = expanded ? "M3 8h5V3m13 5h-5V3M3 16h5v5m13-5h-5v5" : "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5";
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
}
function performanceWidget(id, kind, label, body) {
  const key = `${tab}-${activeDate}-${kind}-${id}`;
  const description = `${label}: ${getExercise(id)?.name || id}`;
  return `<button type="button" class="performance-widget ${kind}" data-action="toggle-performance-widget" data-widget-label="${escapeHtml(description)}" aria-expanded="false" aria-controls="${escapeHtml(key)}" aria-label="Ampliar ${escapeHtml(description)}"><span class="performance-widget-header"><span class="performance-label">${escapeHtml(label)}</span></span><span class="performance-details" id="${escapeHtml(key)}" hidden>${body}</span></button>`;
}
function setPerformanceWidget(button, expanded) {
  const widget = button.closest(".performance-widget");
  const content = widget?.querySelector(".performance-details");
  if (!content) return;
  content.hidden = !expanded;
  widget.classList.toggle("is-expanded", expanded);
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-label", `${expanded ? "Minimizar" : "Ampliar"} ${button.dataset.widgetLabel}`);
}
function syncPerformanceGroup(group) {
  if (!group) return;
  const expanded = [...group.querySelectorAll('.performance-widget')].every(widget => widget.getAttribute('aria-expanded') === 'true');
  const button = group.querySelector('.widgets-toggle-all');
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', `${expanded ? 'Minimizar' : 'Ampliar'} todos los registros: ${button.dataset.exerciseName}`);
}
function togglePerformanceWidget(button) {
  setPerformanceWidget(button, button.getAttribute('aria-expanded') !== 'true');
  syncPerformanceGroup(button.closest('.performance-widget')?.closest?.('.performance-widgets'));
}
function togglePerformanceGroup(button) {
  const group = button.closest('.performance-widgets');
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  group.querySelectorAll('.performance-widget').forEach(widget => setPerformanceWidget(widget, expanded));
  syncPerformanceGroup(group);
}
function performanceWidgetsMarkup(id) {
  const name = getExercise(id)?.name || id;
  return `<div class="performance-widgets"><button type="button" class="widgets-toggle-all" data-action="toggle-performance-group" data-exercise-name="${escapeHtml(name)}" aria-label="Ampliar todos los registros: ${escapeHtml(name)}" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>${lastUseMarkup(id)}${weightHistoryMarkup(id)}</div>`;
}
function lastUseContent(id, beforeDate, compact = false) {
  const use = recordedUses(id, beforeDate).at(-1);
  if (!use) return { label: "Último uso", body: `<span class="performance-empty">${compact ? "Sin registros anteriores." : "No hay series completadas registradas para este ejercicio."}</span>` };
  const cardio = getExercise(id)?.group === "Cardio";
  const summary = use.sets.map((set, i) => `<span class="last-use-set"><span class="previous-set-number">${i + 1}.${set.dropSet ? ' <small class="drop-set-label" title="Drop Set">DS</small>' : ""}</span> ${cardio ? `${formatMeasure(set.minutes)} min · ${formatMeasure(cardioValue(getExercise(id), set))} ${cardioMetric(getExercise(id)).unit}` : `${formatMeasure(set.kg)} kg × ${escapeHtml(set.reps)} reps`}</span>`).join("");
  return { label: `Último uso · ${shortUseDate(use.date)}/${use.date.slice(0, 4)}`, body: `<span class="last-use-sets">${summary}</span>${cardio ? maximumSummaryMarkup(id) : ""}` };
}
function lastUseMarkup(id, beforeDate) {
  const content = lastUseContent(id, beforeDate);
  return performanceWidget(id, "last-use", content.label, content.body);
}
function weightHistoryContent(id, beforeDate, compact = false) {
  if (getExercise(id)?.group === "Cardio") return null;
  const uses = recordedUses(id, beforeDate).slice(-4);
  if (!uses.length) return { label: "Peso máximo · últimos 4 usos", body: `<span class="performance-empty">${compact ? "Sin usos anteriores." : "El gráfico aparecerá al registrar series hechas con peso y repeticiones."}</span>${maximumSummaryMarkup(id)}` };
  const values = uses.map(use => use.maxKg);
  const min = Math.min(...values), max = Math.max(...values);
  const width = compact ? 180 : 300;
  const left = 24, right = width - 24;
  const coords = uses.map((use, i) => ({ x: uses.length === 1 ? width / 2 : left + i * (right - left) / (uses.length - 1), y: max === min ? 44 : 66 - (use.maxKg - min) * 36 / (max - min), use }));
  const description = uses.map(use => `${use.date}: ${formatMeasure(use.maxKg)} kg`).join("; ");
  const body = `<svg class="weight-sparkline" viewBox="0 0 ${width} 104" role="img" aria-label="${escapeHtml(description)}"><path class="graph-grid" d="M16 70H${width - 16}M16 34H${width - 16}"/>${coords.length > 1 ? `<polyline class="graph-line" points="${coords.map(p => `${p.x},${p.y}`).join(" ")}"/>` : ""}${coords.map(p => `<g><title>${escapeHtml(p.use.date)}: ${formatMeasure(p.use.maxKg)} kg</title><circle class="graph-dot" cx="${p.x}" cy="${p.y}" r="3.5"/><text x="${p.x}" y="${p.y - 10}" text-anchor="middle">${formatMeasure(p.use.maxKg)} kg</text><text class="graph-date" x="${p.x}" y="94" text-anchor="middle">${shortUseDate(p.use.date)}</text></g>`).join("")}</svg>${maximumSummaryMarkup(id)}`;
  return { label: `Peso máximo · últimos ${uses.length} ${uses.length === 1 ? "uso" : "usos"}`, body };
}
function weightHistoryMarkup(id, beforeDate) {
  const content = weightHistoryContent(id, beforeDate);
  return content ? performanceWidget(id, "weight-history", content.label, content.body) : "";
}
function sessionPerformanceMarkup(id) {
  const expanded = sessionHistoryOpen.has(`${activeDate}:${id}`);
  const key = `${tab}-${activeDate}-session-history-${id}`;
  const description = `registros de ${getExercise(id)?.name || id}`;
  const last = expanded ? lastUseContent(id, activeDate, true) : null;
  const history = expanded ? weightHistoryContent(id, activeDate, true) : null;
  return `<button type="button" class="performance-widget session-performance${getExercise(id)?.group === "Cardio" ? " is-cardio" : ""}${expanded ? " is-expanded" : ""}" data-action="toggle-session-history" data-id="${escapeHtml(id)}" data-widget-label="${escapeHtml(description)}" aria-expanded="${expanded}" aria-controls="${escapeHtml(key)}" aria-label="${expanded ? "Minimizar" : "Ampliar"} ${escapeHtml(description)}"><span class="session-history-heading"><span>Registros anteriores</span><span>${expanded ? "Ocultar" : "Ver"} <span aria-hidden="true">${expanded ? "⌃" : "⌄"}</span></span></span><span class="performance-details session-performance-columns" id="${escapeHtml(key)}" ${expanded ? "" : "hidden"}>${expanded ? `<span class="session-last-use"><span class="performance-label">${escapeHtml(last.label)}</span>${last.body}</span>${history ? `<span class="session-weight-history"><span class="performance-label">${escapeHtml(history.label)}</span>${history.body}</span>` : ""}` : ""}</span></button>`;
}
function cardioMaximum(id) {
  let best = null;
  for (const [date, session] of Object.entries(state.sessions)) {
    for (const set of session.sets?.[id] || []) {
      if (!set.done) continue;
      const minutes = decimalNumber(set.minutes);
      const distanceKm = decimalNumber(cardioValue(getExercise(id), set));
      if (!Number.isFinite(minutes) || minutes <= 0 || !Number.isFinite(distanceKm) || distanceKm < 0) continue;
      const candidate = { minutes, distanceKm, date };
      if (!best || distanceKm > best.distanceKm ||
          (distanceKm === best.distanceKm && minutes > best.minutes) ||
          (distanceKm === best.distanceKm && minutes === best.minutes && date > best.date)) best = candidate;
    }
  }
  return best;
}
function historicalMaximum(id) {
  let best = null;
  for (const [date, session] of Object.entries(state.sessions)) {
    for (const set of session.sets?.[id] || []) {
      if (!set.done) continue;
      const reps = Number(set.reps);
      if (!Number.isInteger(reps) || reps <= 0) continue;
      const rawKg = String(set.kg ?? "").trim().replace(",", ".");
      const parsedKg = rawKg === "" ? 0 : Number(rawKg);
      if (!Number.isFinite(parsedKg) || parsedKg < 0) continue;
      const candidate = { kg: parsedKg, reps, date };
      if (!best || candidate.kg > best.kg ||
          (candidate.kg === best.kg && candidate.reps > best.reps) ||
          (candidate.kg === best.kg && candidate.reps === best.reps && candidate.date > best.date)) {
        best = candidate;
      }
    }
  }
  return best;
}
function maximumSummaryMarkup(id) {
  if (getExercise(id)?.group === "Cardio") {
    const maximum = cardioMaximum(id);
    if (!maximum) return `<span class="graph-note historical-summary">Máximo histórico: sin registros.</span>`;
    const date = `${maximum.date.slice(8, 10)}/${maximum.date.slice(5, 7)}/${maximum.date.slice(0, 4)}`;
    const format = number => new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(number);
    const value = maximum.distanceKm > 0 ? `${format(maximum.distanceKm)} ${cardioMetric(getExercise(id)).unit}` : `${format(maximum.minutes)} min`;
    const detail = maximum.distanceKm > 0 ? `${format(maximum.minutes)} min · ${date}` : date;
    return `<span class="graph-note historical-summary">Máximo histórico: ${escapeHtml(value)} · ${escapeHtml(detail)}</span>`;
  }
  const maximum = historicalMaximum(id);
  if (!maximum) return `<span class="graph-note historical-summary">Máximo histórico: sin registros.</span>`;
  const date = `${maximum.date.slice(8, 10)}/${maximum.date.slice(5, 7)}/${maximum.date.slice(0, 4)}`;
  const weight = new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(maximum.kg);
  return `<span class="graph-note historical-summary">Máximo histórico: ${escapeHtml(weight)} kg · ${maximum.reps} reps · ${date}</span>`;
}
function showToast(message, undo) {
  const toast = $("#toast");
  toast.textContent = message;
  undoAction = undo || null;
  if (undoAction) {
    const button = document.createElement("button");
    button.type = "button"; button.dataset.action = "undo-removal"; button.textContent = "Deshacer";
    toast.appendChild(button);
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove("show"); undoAction = null; }, undo ? 8000 : 2300);
}
function undoRemovedSet(date, id, set, index, wasCompleted, completed, remainingSnapshot) {
  const session = state.sessions[date];
  if (!session || !session.sets[id] || session.sets[id].some(item => item.id === set.id)) return;
  const unchanged = JSON.stringify(session.sets[id]) === remainingSnapshot;
  session.sets[id].splice(Math.min(index, session.sets[id].length), 0, set);
  if (wasCompleted && unchanged && !Object.hasOwn(session.completed, id)) session.completed[id] = completed;
  persist(); render();
}
function undoRemovedExercise(date, id, index) {
  const session = state.sessions[date];
  if (!session || session.selected.includes(id)) return;
  session.selected.splice(Math.min(index, session.selected.length), 0, id);
  expandedId = id;
  persist(); render();
}
function removeExerciseWithUndo(id) {
  const session = ensureSession();
  const index = session.selected.indexOf(id);
  if (index < 0) return;
  const date = activeDate;
  removeFromSession(id); render();
  showToast("Ejercicio quitado de la sesión", () => undoRemovedExercise(date, id, index));
}
function render() {
  const view = $("#view");
  const filterScrollLeft = view.querySelector(".filter-row")?.scrollLeft || 0;
  view.classList.toggle("session-view", tab === "today");
  view.innerHTML = tab === "today" ? renderToday() : tab === "catalog" ? renderCatalog() : tab === "routines" ? renderRoutinesPage() : renderHistory();
  const filterRow = view.querySelector(".filter-row");
  if (filterRow) filterRow.scrollLeft = filterScrollLeft;
  document.querySelectorAll("[data-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tab);
    if (button.dataset.tab === tab) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
  });
}
function renderSessionSummary(session, exercises) {
  const completed = exercises.filter(ex => isExerciseComplete(session, ex.id)).length;
  return `<section class="summary-card" aria-label="Progreso de la sesión"><div class="summary-number" aria-label="${completed} de ${exercises.length} ejercicios completados">${completed}<span> / ${exercises.length}</span></div><div class="progress-track" role="progressbar" aria-label="Ejercicios completados" aria-valuemin="0" aria-valuemax="${exercises.length || 1}" aria-valuenow="${completed}"><div class="progress-fill" style="width:${exercises.length ? completed / exercises.length * 100 : 0}%"></div></div></section>`;
}
function renderToday() {
  const session = ensureSession();
  const exercises = session.selected.map(getExercise).filter(Boolean);
  return `${renderSessionSummary(session, exercises)}
    <div class="section-head"><h2>Ejercicios de esta sesión</h2><button class="text-button" type="button" data-action="go-catalog">+ Elegir ejercicios</button></div>
    ${exercises.length ? `<div class="session-list">${exercises.map((ex, index) => renderSessionExercise(ex, session, index)).join("")}</div>` : `<div class="empty-state"><div class="empty-icon">＋</div><h3>Tu sesión está vacía</h3><p>Elige los ejercicios que quieras hacer hoy.</p><button class="primary-button" data-action="go-catalog">Abrir inventario</button></div>`}
    <p class="session-date"><time datetime="${escapeHtml(activeDate)}">${escapeHtml(formatDate(activeDate))}</time></p>
    <div class="session-finish"><div><strong>${session.finishedAt ? "✓ Sesión terminada" : "¿Terminaste por hoy?"}</strong><p>${session.finishedAt ? "Tus registros se conservan y puedes corregirlos aquí." : "Guarda tu entrenamiento aunque queden ejercicios pendientes."}</p></div><button type="button" class="${session.finishedAt ? "secondary-button" : "primary-button"}" data-action="${session.finishedAt ? "reopen-session" : "finish-session"}" data-date="${activeDate}">${session.finishedAt ? "Reabrir sesión" : "Terminar sesión"}</button></div>`;
}
function renderSetFields(ex, set, index) {
  const fields = ex.group === "Cardio"
    ? [["minutes", "Minutos", set.minutes], [cardioMetric(ex).field, cardioMetric(ex).label, cardioValue(ex, set)]]
    : [["kg", "Peso kg", set.kg], ["reps", "Repeticiones", set.reps]];
  return fields.map(([field, label, value]) => `<input class="set-input" type="${field === "reps" ? "number" : "text"}" ${field === "reps" ? 'min="0"' : ""} inputmode="${field === "reps" ? "numeric" : "decimal"}" placeholder="—" value="${escapeHtml(value)}" data-set-field="${field}" data-ex="${ex.id}" data-set-id="${set.id}" aria-label="${label} serie ${index + 1}${set.dropSet ? " Drop Set" : ""} de ${escapeHtml(ex.name)}" />`).join("");
}
function refreshSetProgress(input) {
  // Refresh progress without replacing inputs or interrupting the phone keyboard.
  const template = document.createElement("template");
  const session = ensureSession();
  template.innerHTML = renderSessionSummary(session, session.selected.map(getExercise).filter(Boolean));
  $("#view .summary-card").replaceWith(template.content.querySelector(".summary-card"));
  const card = input.closest(".session-card");
  const id = input.dataset.ex;
  const done = isExerciseComplete(session, id);
  const ex = getExercise(id);
  const sets = session.sets[id];
  card.classList.toggle("done", done);
  const badge = card.querySelector(".complete-button");
  badge.classList.toggle("done", done);
  badge.setAttribute("aria-pressed", String(done));
  badge.setAttribute("aria-label", `${done ? "Marcar pendiente" : "Marcar completado"}: ${ex.name}`);
  card.querySelector(".expand-button span").textContent = `${sets.filter(set => set.done).length} de ${sets.length} series hechas`;
  const row = input.closest(".set-row");
  row.querySelector("[data-set-done]").checked = sets.find(set => set.id === input.dataset.setId).done;
}
function renderSessionExercise(ex, session, index) {
  const isOpen = expandedId === ex.id;
  const sets = session.sets[ex.id] || [];
  const done = isExerciseComplete(session, ex.id);
  const pair = `Ejercicio ${index + 1}`;
  return `<article class="session-card${done ? " done" : ""}">
    <div class="session-main">${imageMarkup(ex)}<h3 class="session-heading" title="${escapeHtml(`${pair} · ${ex.group} · ${ex.name}`)}"><span class="exercise-kicker">EJ. ${index + 1} · ${escapeHtml(ex.group)} · </span><span class="session-exercise-name" lang="en">${escapeHtml(ex.name)}</span></h3><button type="button" class="complete-button${done ? " done" : ""}" data-action="toggle-complete" data-id="${ex.id}" aria-label="${done ? "Marcar pendiente" : "Marcar completado"}: ${escapeHtml(ex.name)}" aria-pressed="${done}"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></button></div>
    ${sessionPerformanceMarkup(ex.id)}<button type="button" class="expand-button" data-action="expand" data-id="${ex.id}" aria-expanded="${isOpen}"><span>${sets.filter(set => set.done).length} de ${sets.length} series hechas</span><svg viewBox="0 0 24 24"><path d="m5 9 7 7 7-7"/></svg></button>
    ${isOpen ? `<div class="sets-panel"><div class="set-header"><span>Serie</span><span>${ex.group === "Cardio" ? "Minutos" : "Peso kg"}</span><span>${ex.group === "Cardio" ? cardioMetric(ex).heading : "Reps"}</span><span>Hecha</span><span></span></div>${sets.map((set, i) => `<div class="set-row"><span class="set-index">${String(i + 1).padStart(2, "0")}${set.dropSet ? '<small class="drop-set-label" title="Drop Set">DS</small>' : ""}</span>${renderSetFields(ex, set, i)}<input class="set-check" type="checkbox" ${set.done ? "checked" : ""} data-set-done data-ex="${ex.id}" data-set-id="${set.id}" aria-label="Serie ${i + 1}${set.dropSet ? " Drop Set" : ""} hecha" /><button type="button" class="remove-set" data-action="remove-set" data-id="${ex.id}" data-set-id="${set.id}" aria-label="Quitar serie ${i + 1}${set.dropSet ? " Drop Set" : ""}"><svg viewBox="0 0 24 24"><path d="M5 7h14m-12 0 1 13h8l1-13M9 7V4h6v3"/></svg></button></div>`).join("")}<div class="panel-actions"><div class="add-set-actions"><button type="button" class="add-set" data-action="add-set" data-id="${ex.id}" aria-label="Añadir serie a ${escapeHtml(ex.name)}" title="Añadir serie"><span aria-hidden="true">+</span></button>${ex.group === "Cardio" ? "" : `<button type="button" class="add-set add-drop-set" data-action="add-drop-set" data-id="${ex.id}" aria-label="Añadir Drop Set a ${escapeHtml(ex.name)}" title="Añadir Drop Set"><span aria-hidden="true">+ DS</span></button>`}</div><button type="button" class="remove-from-day" data-action="remove-exercise" data-id="${ex.id}">Quitar de hoy</button></div></div>` : ""}</article>`;
}
function renderCatalog() {
  ensureSession();
  return `<div class="view-header catalog-header compact-catalog-header"><p class="eyebrow">Tu inventario</p><h1 class="view-title">Ejercicios</h1><div class="catalog-header-bottom"><div class="subtle">Elige movimientos y agrégalos a tu sesión.</div><div class="header-actions"><button type="button" class="secondary-button" data-action="new-routine">Crear rutina</button><button type="button" class="primary-button light" data-action="new-exercise">+ Nuevo</button></div></div></div>
    <div class="search-row"><input id="catalog-search" class="search-field" type="search" placeholder="Buscar ejercicio o equipo" value="${escapeHtml(catalogSearch)}" aria-label="Buscar ejercicios" /></div>
    <div class="filter-row" role="group" aria-label="Filtrar por grupo muscular">${["Todos", ...GROUPS.filter(group => state.exercises.some(ex => !ex.archived && ex.group === group)), "Archivados"].map(group => `<button type="button" class="filter${catalogFilter === group ? " active" : ""}" data-filter="${group}">${group}</button>`).join("")}</div>
    <div id="catalog-list" class="catalog-grid">${renderCatalogCards()}</div><p class="note">Estas ilustraciones son ejemplos de movimientos; puedes adaptar o añadir ejercicios según las máquinas de tu gimnasio.</p><button type="button" class="catalog-return" data-action="return-session">Ver sesión · ${ensureSession().selected.length} ${ensureSession().selected.length === 1 ? "ejercicio" : "ejercicios"} <span aria-hidden="true">→</span></button>`;
}
function renderCatalogCards() {
  const selected = ensureSession().selected;
  const query = catalogSearch.trim().toLocaleLowerCase("es");
  const filtered = favoritesFirst(state.exercises.filter(ex => (catalogFilter === "Archivados" ? ex.archived : !ex.archived && (catalogFilter === "Todos" || ex.group === catalogFilter)) && exerciseMatches(ex, query)));
  if (!filtered.length) return `<div class="empty-state" style="grid-column:1/-1"><h3>No hay coincidencias</h3><p>Prueba otra búsqueda o añade un ejercicio.</p></div>`;
  return filtered.map(ex => {
    const details = catalogDetailsOpen.has(ex.id);
    return `<article class="catalog-card">${catalogImageButton(ex)}<div class="catalog-content"><div class="catalog-card-heading"><div class="exercise-kicker">${escapeHtml(ex.group)}</div>${favoriteButton(ex)}</div><h3 class="exercise-title" lang="en">${escapeHtml(ex.name)}</h3><div class="exercise-meta">${escapeHtml(ex.equipment)}</div><div class="catalog-actions">${ex.archived ? `<button type="button" class="catalog-add" data-action="restore-exercise" data-id="${ex.id}">Restaurar</button>` : `<button type="button" class="catalog-add${selected.includes(ex.id) ? " selected" : ""}" data-action="catalog-toggle" data-id="${ex.id}">${selected.includes(ex.id) ? "✓ En sesión" : "+ Añadir"}</button>`}</div><button type="button" class="catalog-details-toggle" data-action="catalog-details" data-id="${escapeHtml(ex.id)}" aria-expanded="${details}">${details ? "Ocultar detalles ⌃" : "Ver detalles ⌄"}</button><div class="catalog-details" ${details ? "" : "hidden"}>${details ? `${performanceWidgetsMarkup(ex.id)}<button type="button" class="secondary-button catalog-edit" data-action="edit-exercise" data-id="${ex.id}" aria-label="Editar ${escapeHtml(ex.name)}">Editar ejercicio</button>` : ""}</div></div></article>`;
  }).join("");
}
function availableRoutineExercises(routine) {
  return [...new Set(routine.exerciseIds)].map(getExercise).filter(ex => ex && !ex.archived);
}
function renderRoutinesPage() {
  return `<div class="view-header catalog-header"><div><p class="eyebrow">Tu entrenamiento</p><h1 class="view-title">Rutinas</h1><div class="subtle">Tus combinaciones favoritas, organizadas por músculo.</div></div><button type="button" class="primary-button light" data-action="new-routine">+ Crear rutina</button></div>${renderRoutines()}`;
}
function renderRoutines() {
  const groups = [...new Set(state.routines.map(routine => routine.group))];
  return `<section class="routines-section" aria-labelledby="routines-title"><div class="section-head"><h2 id="routines-title">Mis rutinas</h2><span class="subtle">${state.routines.length}</span></div><p class="subtle routine-intro">Añade una rutina completa a tu sesión del ${escapeHtml(formatDate(activeDate))}.</p>${groups.length ? groups.map(group => `<div class="routine-group"><h3 class="exercise-kicker">${escapeHtml(group)}</h3><div class="routine-grid">${state.routines.filter(routine => routine.group === group).map(routine => {
    const exercises = availableRoutineExercises(routine);
    const missing = routine.exerciseIds.length - exercises.length;
    const allSelected = exercises.length > 0 && exercises.every(ex => ensureSession().selected.includes(ex.id));
    return `<article class="routine-card"><h4>${escapeHtml(routine.name)}</h4><div class="subtle">${exercises.length} ${exercises.length === 1 ? "ejercicio disponible" : "ejercicios disponibles"}</div><ul>${exercises.map(ex => `<li><span lang="en">${escapeHtml(ex.name)}</span></li>`).join("")}</ul>${missing ? `<p class="routine-warning">${missing} ${missing === 1 ? "ejercicio archivado o no disponible" : "ejercicios archivados o no disponibles"}.</p>` : ""}<div class="routine-actions"><button type="button" class="catalog-add${allSelected ? " selected" : ""}" data-action="add-routine" data-id="${escapeHtml(routine.id)}" ${!exercises.length || allSelected ? "disabled" : ""}>${allSelected ? "✓ En sesión" : "+ Añadir a sesión"}</button><button type="button" class="secondary-button" data-action="edit-routine" data-id="${escapeHtml(routine.id)}" aria-label="Editar rutina ${escapeHtml(routine.name)}">Editar</button></div></article>`;
  }).join("")}</div></div>`).join("") : `<div class="routine-empty">Guarda tus combinaciones favoritas por músculo con el botón <strong>Crear rutina</strong>.</div>`}</section>`;
}
function openRoutineForm(id) {
  const existing = state.routines.find(routine => routine.id === id);
  const group = existing?.group || (GROUPS.includes(catalogFilter) ? catalogFilter : "Bíceps");
  routineDraft = { id: existing?.id, group, exerciseIds: new Set(existing?.exerciseIds || []) };
  openOverlay(`<h2 id="sheet-title">${existing ? "Editar rutina" : "Crear rutina"}</h2><p>Elige un músculo y los ejercicios que quieras guardar juntos.</p><form id="routine-form"><label class="field-label" for="routine-name">Nombre de la rutina</label><input id="routine-name" class="field" required maxlength="90" value="${escapeHtml(existing?.name || "")}" placeholder="Ej. Rutina de pecho A" /><label class="field-label" for="routine-group">Músculo</label><select id="routine-group" class="field">${GROUPS.map(item => `<option value="${item}" ${item === group ? "selected" : ""}>${item}</option>`).join("")}</select><p class="routine-help">Al cambiar de músculo, elige los ejercicios de ese grupo.</p><label class="field-label" for="routine-search">Buscar ejercicios</label><input id="routine-search" class="search-field routine-search" type="search" placeholder="Nombre o equipo" /><div id="routine-options" class="routine-options"></div><p id="routine-count" class="routine-count" role="status" aria-live="polite"></p><p id="routine-error" class="routine-warning" role="alert"></p><div class="sheet-buttons"><button type="button" class="secondary-button" data-close-overlay>Cancelar</button><button type="submit" class="primary-button">Guardar rutina</button></div>${existing ? `<button type="button" class="remove-from-day" data-action="delete-routine" data-id="${escapeHtml(existing.id)}">Eliminar rutina</button>` : ""}</form>`);
  renderRoutineOptions();
}
function renderRoutineOptions() {
  const query = $("#routine-search").value.trim().toLocaleLowerCase("es");
  const exercises = favoritesFirst(state.exercises.filter(ex => ex.group === routineDraft.group && (!ex.archived || routineDraft.exerciseIds.has(ex.id)) && exerciseMatches(ex, query)));
  $("#routine-options").innerHTML = exercises.length ? exercises.map(ex => `<label class="routine-option"><input type="checkbox" aria-label="${escapeHtml(ex.name)}" data-routine-ex="${escapeHtml(ex.id)}" ${routineDraft.exerciseIds.has(ex.id) ? "checked" : ""} />${imageMarkup(ex, "routine-thumbnail")}<span class="routine-option-copy"><strong lang="en">${escapeHtml(ex.name)}</strong><small>${ex.archived ? "Archivado · no se añadirá a la sesión" : escapeHtml(ex.equipment)}</small></span></label>`).join("") : `<p class="routine-empty">${query ? "No hay coincidencias con esta búsqueda." : "No hay ejercicios disponibles para este músculo. Añádelos desde Nuevo."}</p>`;
  updateRoutineCount();
}
function updateRoutineCount() {
  const count = routineDraft.exerciseIds.size;
  $("#routine-count").textContent = `${count} ${count === 1 ? "ejercicio seleccionado" : "ejercicios seleccionados"}`;
  $("#routine-error").textContent = "";
}
async function saveRoutine() {
  const name = $("#routine-name").value.trim();
  const exerciseIds = [...routineDraft.exerciseIds];
  if (!name || !availableRoutineExercises({ exerciseIds }).length) {
    $("#routine-error").textContent = !name ? "Escribe un nombre para la rutina." : "Selecciona al menos un ejercicio disponible.";
    return;
  }
  const button = $("#routine-form [type=submit]");
  if (button.disabled) return;
  button.disabled = true;
  const routine = { id: routineDraft.id || uid(), name, group: routineDraft.group, exerciseIds };
  const index = state.routines.findIndex(item => item.id === routine.id);
  if (index < 0) state.routines.push(routine); else state.routines[index] = routine;
  try { await persistNow(); } catch { button.disabled = false; showToast("No se pudo guardar la rutina"); return; }
  closeOverlay(); tab = "routines"; render(); window.scrollTo(0, 0);
  showToast(index < 0 ? "Rutina guardada" : "Rutina actualizada");
}
async function addRoutineToSession(id) {
  const routine = state.routines.find(item => item.id === id);
  if (!routine) return;
  const exercises = availableRoutineExercises(routine);
  const added = exercises.filter(ex => !ensureSession().selected.includes(ex.id));
  added.forEach(ex => addToSession(ex.id));
  try { await persistNow(); } catch { showToast("No se pudo guardar la sesión"); return; }
  render();
  showToast(added.length ? `${added.length} ${added.length === 1 ? "ejercicio añadido" : "ejercicios añadidos"} a la sesión` : exercises.length ? "La rutina ya está en la sesión" : "Esta rutina no tiene ejercicios disponibles");
}
function hasRecordedSet(set) {
  if (set.done === true) return true;
  if (set.prefilled === true) return false;
  return [set.kg, set.reps, set.minutes, set.distanceKm, set.speedKmh].some(value => Number.isFinite(decimalNumber(value)) && decimalNumber(value) > 0);
}
function hasSessionActivity(session) {
  if (!session) return false;
  if (Object.values(session.completed || {}).some(value => value === true)) return true;
  return Object.values(session.sets || {}).some(sets => sets.some(hasRecordedSet));
}
function sessionSummaryData(date) {
  const session = state.sessions[date];
  if (!session) return null;
  const ids = [...new Set([...(session.selected || []), ...Object.keys(session.sets || {}), ...Object.keys(session.completed || {})])];
  const exercises = ids.map(id => {
    const sets = (session.sets?.[id] || []).map((set, index) => ({ set, number: index + 1 })).filter(row => hasRecordedSet(row.set));
    return { exercise: getExercise(id), sets, markedDone: session.completed?.[id] === true };
  }).filter(item => item.sets.length || item.markedDone);
  return { exercises, completedSets: exercises.reduce((count, item) => count + item.sets.filter(row => row.set.done === true).length, 0), finished: Boolean(session.finishedAt) };
}
function summarySetText(exercise, set) {
  const measure = value => String(value ?? "").trim() !== "" && Number.isFinite(decimalNumber(value)) && decimalNumber(value) >= 0 ? formatMeasure(value) : "—";
  if (exercise?.group === "Cardio") {
    const metric = cardioValue(exercise, set);
    return `${measure(set.minutes)} min${String(metric ?? "").trim() !== "" ? ` · ${measure(metric)} ${cardioMetric(exercise).unit}` : ""}`;
  }
  const kg = decimalNumber(set.kg);
  const weight = String(set.kg ?? "").trim() === "" || kg === 0 ? "Peso corporal" : `${measure(set.kg)} kg`;
  return `${weight} × ${measure(set.reps)} reps`;
}
function renderHistorySummary(date) {
  const summary = sessionSummaryData(date);
  if (!summary) return "";
  return `<h2 id="sheet-title">Resumen del entrenamiento</h2><p class="history-summary-date">${escapeHtml(formatDate(date))}${summary.finished ? " · Sesión terminada" : ""}</p>
    ${summary.exercises.length ? `<div class="history-summary-totals"><span><strong>${summary.exercises.length}</strong> ${summary.exercises.length === 1 ? "ejercicio registrado" : "ejercicios registrados"}</span><span><strong>${summary.completedSets}</strong> ${summary.completedSets === 1 ? "serie hecha" : "series hechas"}</span></div>${summary.completedSets ? "" : '<p class="history-summary-notice">No hay series marcadas como realizadas. Estos datos quedaron registrados sin marcar.</p>'}<div class="history-summary-list">${summary.exercises.map(item => `<article class="history-summary-exercise"><div class="history-summary-exercise-heading">${item.exercise ? imageMarkup(item.exercise, "exercise-image history-summary-image") : ""}<div class="history-summary-exercise-copy"><h3>${escapeHtml(item.exercise?.name || "Ejercicio no disponible")}</h3>${item.exercise ? `<span class="history-summary-group">${escapeHtml(item.exercise.group)}</span>` : ""}</div></div>${item.sets.length ? `<ul>${item.sets.map(row => `<li><span class="history-summary-index">${row.number}.${row.set.dropSet ? ' <small class="drop-set-label" title="Drop Set">DS</small>' : ""}</span><span>${escapeHtml(summarySetText(item.exercise, row.set))}</span><span class="history-summary-status${row.set.done ? " is-done" : ""}">${row.set.done ? "✓ Hecha" : "Sin marcar"}</span></li>`).join("")}</ul>` : '<p>Marcado como realizado, sin series detalladas.</p>'}</article>`).join("")}</div>` : '<div class="history-summary-empty"><strong>Sin actividad registrada</strong><p>Esta fecha solo tiene una sesión abierta o preparada. No cuenta como entrenamiento y podés eliminarla.</p></div>'}
    <div class="sheet-buttons history-summary-actions"><button type="button" class="secondary-button" data-close-overlay>Cerrar</button><button type="button" class="delete-session-button" data-action="delete-session" data-date="${escapeHtml(date)}">Eliminar registro</button></div>`;
}
function openHistorySummary(date) {
  if (!Object.hasOwn(state.sessions, date)) return;
  openOverlay(renderHistorySummary(date));
}
function shiftHistoryMonth(offset) {
  const [year, month] = historyMonth.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1, 12);
  historyMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
function renderHistory() {
  const [year, month] = historyMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1, 12);
  const leading = (first.getDay() + 6) % 7;
  const days = new Date(year, month, 0, 12).getDate();
  const label = new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric" }).format(first);
  const recorded = new Set(Object.keys(state.sessions).filter(date => hasSessionActivity(state.sessions[date])));
  const count = [...recorded].filter(date => date.startsWith(historyMonth)).length;
  const cells = Array.from({ length: Math.ceil((leading + days) / 7) * 7 }, (_, index) => {
    const day = index - leading + 1;
    if (day < 1 || day > days) return `<span class="calendar-blank" aria-hidden="true"></span>`;
    const date = `${historyMonth}-${String(day).padStart(2, "0")}`;
    const hasRecord = recorded.has(date);
    const hasDraft = !hasRecord && Object.hasOwn(state.sessions, date);
    return `<button type="button" class="calendar-day${hasRecord ? " has-record" : hasDraft ? " has-draft" : ""}${date === todayISO() ? " is-today" : ""}" data-action="open-date" data-date="${date}" ${hasRecord || hasDraft ? "" : "disabled"} ${date === todayISO() ? 'aria-current="date"' : ""} aria-label="${escapeHtml(formatDate(date))}: ${hasRecord ? "con registro, ver resumen" : hasDraft ? "sin actividad, revisar o eliminar registro" : "sin registro"}"><span>${day}</span>${hasRecord ? '<span class="calendar-dot" aria-hidden="true"></span>' : hasDraft ? '<span class="calendar-dot draft-dot" aria-hidden="true"></span>' : ""}</button>`;
  }).join("");
  return `<div class="view-header"><div><p class="eyebrow">Tu progreso</p><h1 class="view-title">Historial</h1><div class="subtle">Tocá una fecha para ver el resumen o eliminar su registro.</div></div></div><section class="history-calendar" aria-labelledby="calendar-title"><div class="calendar-heading"><button type="button" class="secondary-button calendar-arrow" data-action="history-prev" aria-label="Mes anterior">‹</button><h2 id="calendar-title">${escapeHtml(label)}</h2><button type="button" class="secondary-button calendar-arrow" data-action="history-next" aria-label="Mes siguiente">›</button></div><div class="calendar-tools"><label for="history-month">Ir al mes</label><input id="history-month" class="date-input" type="month" min="1900-01" max="9999-12" value="${historyMonth}" /><button type="button" class="text-button" data-action="history-current">Este mes</button></div><div class="calendar-weekdays" aria-hidden="true">${["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => `<span>${day}</span>`).join("")}</div><div class="calendar-days">${cells}</div><div class="calendar-legend"><span class="calendar-dot" aria-hidden="true"></span> Con actividad <span class="calendar-dot draft-dot" aria-hidden="true"></span> Sin actividad <span class="calendar-total">${count} ${count === 1 ? "día este mes" : "días este mes"}</span></div>${count ? "" : '<p class="calendar-empty">No hay entrenamientos registrados en este mes.</p>'}</section><p class="note">Los valores sugeridos y los días que solo abrís no cuentan como entrenamiento. Las fechas sin actividad se pueden abrir para eliminar su registro.</p><button type="button" class="secondary-button history-backup" id="backup-open">Respaldo de datos</button>`;
}
function openDeleteSession(date) {
  if (!Object.hasOwn(state.sessions, date)) return;
  openOverlay(`<h2 id="sheet-title">Eliminar registro</h2><p>¿Querés eliminar el registro del <strong>${escapeHtml(formatDate(date))}</strong>? Se borrarán sus series, pesos, repeticiones y marcas de realizado. Tus rutinas y las demás sesiones se conservarán.</p><p>Esta acción no se puede deshacer. Puedes exportar un respaldo antes de eliminarla.</p><div class="sheet-buttons"><button type="button" class="secondary-button" data-close-overlay>Cancelar</button><button type="button" class="danger-button" data-action="confirm-delete-session" data-date="${date}">Sí, eliminar registro</button></div>`);
}
async function setSessionFinished(date, finished) {
  const session = state.sessions[date];
  if (!session || (finished && !hasSessionActivity(session))) {
    showToast("Registra al menos una serie o ejercicio antes de terminar.");
    return false;
  }
  const previous = session.finishedAt;
  if (finished) session.finishedAt ||= new Date().toISOString();
  else delete session.finishedAt;
  try { await persistNow(); } catch {
    if (previous === undefined) delete session.finishedAt; else session.finishedAt = previous;
    showToast("No se pudo guardar el cambio. Inténtalo de nuevo.");
    return false;
  }
  if (finished) { historyMonth = date.slice(0, 7); tab = "history"; }
  render(); window.scrollTo(0, 0);
  showToast(finished ? "Sesión terminada. Registros guardados." : "Sesión reabierta");
  return true;
}
async function deleteSession(date) {
  const session = state.sessions[date];
  if (!session) return false;
  delete state.sessions[date];
  try { await persistNow(); } catch {
    state.sessions[date] = session;
    showToast("No se pudo eliminar la sesión. Inténtalo de nuevo.");
    return false;
  }
  historyMonth = date.slice(0, 7);
  expandedId = "";
  tab = "history";
  closeOverlay(); render(); window.scrollTo(0, 0);
  showToast("Registro eliminado");
  return true;
}
function openOverlay(html, imagePreview = false) {
  $("#overlay").classList.toggle("image-preview-open", imagePreview);
  $(".sheet").classList.toggle("image-sheet", imagePreview);
  $("#sheet-content").innerHTML = html;
  $("#overlay").classList.remove("hidden");
  $("#overlay").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".sheet button, .sheet input")?.focus();
}
function closeOverlay() {
  routineDraft = undefined;
  $("#overlay").classList.add("hidden");
  $("#overlay").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("image-preview-open");
  $(".sheet").classList.remove("image-sheet");
  document.body.style.overflow = "";
}
function openImagePreview(id) {
  const ex = getExercise(id);
  if (!ex) return;
  const tileViews = ["6 47 339 299", "345 47 338 299", "6 346 339 311", "345 346 338 311", "6 657 339 312", "345 657 338 312"];
  const source = ex.image || STARTER_ILLUSTRATIONS[ex.id];
  if (!source && !Number.isInteger(ex.tile)) {
    openOverlay(`<h2 id="sheet-title" lang="en">${escapeHtml(ex.name)}</h2><p>La imagen de este ejercicio está pendiente. Puedes añadir una foto desde Editar.</p><button type="button" class="primary-button" data-close-overlay>Cerrar</button>`);
    return;
  }
  const illustration = source
    ? `<img class="preview-illustration" src="${escapeHtml(source)}" alt="Ilustración completa de ${escapeHtml(ex.name)}" />`
    : `<svg class="preview-illustration" viewBox="${tileViews[ex.tile] || tileViews[0]}" role="img" aria-label="Ilustración completa de ${escapeHtml(ex.name)}"><image href="./assets/ejercicios-referencia.png" width="684" height="978" /></svg>`;
  openOverlay(`<div class="image-preview-heading"><h2 id="sheet-title" lang="en">${escapeHtml(ex.name)}</h2><button type="button" class="image-close" data-close-overlay aria-label="Cerrar ilustración">✕</button></div>${illustration}`, true);
}
function openExerciseForm(id) {
  const ex = id ? getExercise(id) : null;
  const options = GROUPS.map(group => `<option value="${group}" ${ex?.group === group ? "selected" : ""}>${group}</option>`).join("");
  openOverlay(`<h2 id="sheet-title">${ex ? "Editar ejercicio" : "Nuevo ejercicio"}</h2>
    <p>${ex ? "Actualiza el nombre, equipo o imagen del movimiento." : "Añade una imagen para reconocerlo rápidamente en el gimnasio."}</p>
    <form id="exercise-form" data-edit-id="${ex?.id || ""}">
      <label class="field-label" for="exercise-name">Nombre en inglés</label>
      <input id="exercise-name" class="field" name="name" lang="en" required maxlength="90" value="${escapeHtml(ex?.name || "")}" placeholder="Ej. Machine Chest Press" />
      <label class="field-label" for="exercise-group">Grupo muscular</label>
      <select id="exercise-group" class="field" name="group">${options}</select>
      <label class="field-label" for="exercise-equipment">Equipo o máquina</label>
      <input id="exercise-equipment" class="field" name="equipment" maxlength="90" value="${escapeHtml(ex?.equipment || "")}" placeholder="Ej. Technogym · Polea" />
      <label class="field-label" for="exercise-photo">${ex ? "Cambiar imagen (opcional)" : "Imagen del ejercicio"}</label>
      <input id="exercise-photo" class="file-control" type="file" accept="image/*" ${ex ? "" : "required"} />
      <div class="sheet-buttons"><button type="button" class="secondary-button" data-close-overlay>Cancelar</button><button type="submit" class="primary-button">Guardar ejercicio</button></div>
      ${ex ? `<button type="button" class="remove-from-day" style="margin-top:16px" data-action="archive-exercise" data-id="${ex.id}">${ex.archived ? "Restaurar ejercicio" : "Archivar ejercicio"}</button>` : ""}
    </form>`);
}
function openBackup() {
  openOverlay(`<h2 id="sheet-title">Respaldo de datos</h2><p>Tus rutinas, sesiones e imágenes añadidas se guardan en este navegador. Exporta una copia para poder recuperarlas.</p><button type="button" class="backup-action" data-action="export"><span>Exportar respaldo<small>Descarga ejercicios, rutinas y sesiones en JSON</small></span><svg viewBox="0 0 24 24"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></svg></button><button type="button" class="backup-action" data-action="import"><span>Importar respaldo<small>Reemplaza los datos de este dispositivo</small></span><svg viewBox="0 0 24 24"><path d="M12 20V8m0 0 4 4m-4-4-4 4M4 4h16v3"/></svg></button><div class="sheet-buttons"><button type="button" class="secondary-button" data-close-overlay>Cerrar</button></div>`);
}
function addToSession(id) {
  const session = ensureSession();
  if (session.selected.includes(id)) return;
  session.selected.push(id);
  if (!session.sets[id]) {
    const ex = getExercise(id);
    // Drop Sets remain in history but never seed a new normal strength set.
    const previous = ex?.group === "Cardio" ? undefined : lastRegularSet(id, activeDate);
    session.sets[id] = Array.from({ length: 3 }, () => newSetFor(ex, previous));
  }
  expandedId = id;
  persist();
}
function removeFromSession(id) {
  const session = ensureSession();
  session.selected = session.selected.filter(item => item !== id);
  if (expandedId === id) expandedId = session.selected[0] || "";
  persist();
}
async function resizePhoto(file) {
  let image;
  if (typeof createImageBitmap === "function") {
    try { image = await createImageBitmap(file); } catch { /* Use the browser image decoder below. */ }
  }
  if (!image) image = await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = error => { URL.revokeObjectURL(url); reject(error); };
    img.src = url;
  });
  const scale = Math.min(1, 900 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close?.();
  return canvas.toDataURL("image/jpeg", .82);
}
async function exportBackup() {
  await persistNow();
  const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cumpafit-${todayISO()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  closeOverlay();
  showToast("Respaldo descargado");
}
async function importBackup(file) {
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed.version !== 1 || !Array.isArray(parsed.exercises) || !parsed.sessions || typeof parsed.sessions !== "object") throw new Error("Formato no válido");
    if (parsed.routines !== undefined && (!Array.isArray(parsed.routines) || parsed.routines.some(routine => !routine || typeof routine.id !== "string" || typeof routine.name !== "string" || !GROUPS.includes(routine.group) || !Array.isArray(routine.exerciseIds) || routine.exerciseIds.some(id => typeof id !== "string")) || new Set(parsed.routines.map(routine => routine.id)).size !== parsed.routines.length)) throw new Error("Rutinas no válidas");
    if (!confirm("Esto reemplazará todos los ejercicios, rutinas y sesiones de este dispositivo. ¿Continuar?")) return;
    state = { version: 1, exercises: parsed.exercises, sessions: parsed.sessions, routines: (parsed.routines || []).map(routine => ({ ...routine, exerciseIds: [...new Set(routine.exerciseIds)] })) };
    migrateExerciseNames(state);
    clearTimeout(saveTimer);
    await saveChain;
    await writeState(structuredClone(state));
    activeDate = todayISO();
    tab = "today";
    expandedId = state.exercises[0]?.id || "";
    closeOverlay();
    render();
    showToast("Respaldo importado");
  } catch (error) {
    console.error(error);
    showToast("El archivo no es un respaldo válido");
  }
}

document.addEventListener("click", async event => {
  const nav = event.target.closest("[data-tab]");
  if (nav) { tab = nav.dataset.tab; if (tab === "history") historyMonth = activeDate.slice(0, 7); render(); window.scrollTo(0, 0); return; }
  if (event.target.closest("#backup-open")) { openBackup(); return; }
  if (event.target.closest("[data-close-overlay]")) { closeOverlay(); return; }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "undo-removal") { const undo = undoAction; undoAction = null; clearTimeout(toastTimer); $("#toast").classList.remove("show"); if (undo) undo(); return; }
  if (action === "toggle-session-history") {
    const key = `${activeDate}:${id}`;
    if (sessionHistoryOpen.has(key)) sessionHistoryOpen.delete(key); else sessionHistoryOpen.add(key);
    const card = button.closest(".session-card");
    const session = ensureSession();
    const index = session.selected.indexOf(id);
    const ex = getExercise(id);
    if (card && ex && index >= 0) {
      const holder = document.createElement("template");
      holder.innerHTML = sessionPerformanceMarkup(id);
      button.replaceWith(holder.content.firstElementChild);
    }
    return;
  }
  if (action === "catalog-details") {
    const details = button.nextElementSibling;
    const expanded = !catalogDetailsOpen.has(id);
    if (expanded) {
      catalogDetailsOpen.add(id);
      details.innerHTML = `${performanceWidgetsMarkup(id)}<button type="button" class="secondary-button catalog-edit" data-action="edit-exercise" data-id="${escapeHtml(id)}" aria-label="Editar ${escapeHtml(getExercise(id)?.name || id)}">Editar ejercicio</button>`;
    } else catalogDetailsOpen.delete(id);
    details.hidden = !expanded;
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "Ocultar detalles ⌃" : "Ver detalles ⌄";
    return;
  }
  if (action === "return-session") { tab = "today"; render(); window.scrollTo(0, 0); return; }
  if (action === "toggle-performance-widget") { togglePerformanceWidget(button); return; }
  if (action === "toggle-performance-group") { togglePerformanceGroup(button); return; }
  if (action === "toggle-favorite") {
    if (button.disabled) return;
    button.disabled = true;
    if (!await toggleExerciseFavorite(id)) button.disabled = false;
    return;
  }
  if (action === "finish-session" || action === "reopen-session") {
    if (button.disabled) return;
    button.disabled = true;
    if (!await setSessionFinished(button.dataset.date, action === "finish-session")) button.disabled = false;
    return;
  }
  if (action === "go-history") { historyMonth = activeDate.slice(0, 7); tab = "history"; render(); window.scrollTo(0, 0); return; }
  if (action === "delete-session") { openDeleteSession(button.dataset.date); return; }
  if (action === "confirm-delete-session") {
    if (button.disabled) return;
    button.disabled = true;
    if (!await deleteSession(button.dataset.date)) button.disabled = false;
    return;
  }
  if (action === "history-prev" || action === "history-next") { shiftHistoryMonth(action === "history-prev" ? -1 : 1); render(); return; }
  if (action === "history-current") { historyMonth = todayISO().slice(0, 7); render(); return; }
  if (action === "open-date") {
    openHistorySummary(button.dataset.date); return;
  }
  const session = ensureSession();
  if (action === "go-catalog") { tab = "catalog"; render(); window.scrollTo(0, 0); }
  if (action === "new-exercise") openExerciseForm();
  if (action === "new-routine") openRoutineForm();
  if (action === "edit-routine") openRoutineForm(id);
  if (action === "add-routine") await addRoutineToSession(id);
  if (action === "delete-routine") {
    const routine = state.routines.find(item => item.id === id);
    if (routine && confirm(`¿Eliminar la rutina «${routine.name}»? Los ejercicios de tus sesiones se conservarán.`)) {
      state.routines = state.routines.filter(item => item.id !== id);
      try { await persistNow(); } catch { showToast("No se pudo guardar el cambio"); return; }
      closeOverlay(); render(); showToast("Rutina eliminada");
    }
  }
  if (action === "view-image") openImagePreview(id);
  if (action === "edit-exercise") openExerciseForm(id);
  if (action === "expand") { expandedId = expandedId === id ? "" : id; render(); }
  if (action === "toggle-complete") { session.completed[id] = !isExerciseComplete(session, id); persist(); render(); }
  if (action === "add-set" || action === "add-drop-set") {
    const ex = getExercise(id);
    if (!ex || (action === "add-drop-set" && ex.group === "Cardio")) return;
    const sets = session.sets[id] ||= [];
    const dropSet = action === "add-drop-set";
    const candidates = dropSet ? sets : sets.filter(set => !set.dropSet);
    const populated = set => ex.group === "Cardio" ? String(set.minutes ?? "").trim() !== "" : (String(set.kg ?? "").trim() !== "" || set.done) && String(set.reps ?? "").trim() !== "";
    const previous = [...candidates].reverse().find(set => populated(set) && (!set.prefilled || set.done)) || [...candidates].reverse().find(populated) || (dropSet ? undefined : lastRegularSet(id));
    const set = newSetFor(ex, previous);
    if (dropSet) set.dropSet = true;
    sets.push(set);
    delete session.completed[id];
    persist(); render();
  }
  if (action === "remove-set") {
    const sets = session.sets[id] || [];
    const index = sets.findIndex(set => set.id === button.dataset.setId);
    if (index < 0) return;
    const date = activeDate, removed = sets[index];
    const wasCompleted = Object.hasOwn(session.completed, id), completed = session.completed[id];
    sets.splice(index, 1);
    const remainingSnapshot = JSON.stringify(sets);
    delete session.completed[id];
    persist(); render();
    showToast("Serie quitada", () => undoRemovedSet(date, id, removed, index, wasCompleted, completed, remainingSnapshot));
  }
  if (action === "remove-exercise") { removeExerciseWithUndo(id); return; }
  if (action === "catalog-toggle") {
    if (session.selected.includes(id)) { removeExerciseWithUndo(id); return; }
    addToSession(id); render(); showToast("Añadido a la sesión");
  }
  if (action === "archive-exercise" || action === "restore-exercise") {
    const ex = getExercise(id);
    if (!ex) return;
    ex.archived = action === "archive-exercise";
    persist(); closeOverlay(); render();
    showToast(ex.archived ? "Ejercicio archivado" : "Ejercicio restaurado");
  }
  if (action === "export") exportBackup();
  if (action === "import") $("#import-file").click();
});
document.addEventListener("input", event => {
  if (event.target.id === "routine-search") { renderRoutineOptions(); return; }
  if (event.target.id === "catalog-search") { catalogSearch = event.target.value; $("#catalog-list").innerHTML = renderCatalogCards(); return; }
  const field = event.target.dataset.setField;
  if (!field) return;
  const set = ensureSession().sets[event.target.dataset.ex]?.find(item => item.id === event.target.dataset.setId);
  if (set) {
    set[field] = event.target.value;
    delete set.prefilled;
    if (getExercise(event.target.dataset.ex)?.group !== "Cardio" && (field === "kg" || field === "reps") && updateAutoDone(set)) {
      delete ensureSession().completed[event.target.dataset.ex];
      refreshSetProgress(event.target);
    }
    persist();
  }
});
document.addEventListener("change", event => {
  if (event.target.id === "history-month") {
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value)) { historyMonth = event.target.value; render(); }
    return;
  }
  if (event.target.id === "routine-group") {
    routineDraft.group = event.target.value;
    routineDraft.exerciseIds.clear();
    $("#routine-search").value = "";
    renderRoutineOptions(); return;
  }
  if (event.target.matches("[data-routine-ex]")) {
    const id = event.target.dataset.routineEx;
    if (event.target.checked) routineDraft.exerciseIds.add(id); else routineDraft.exerciseIds.delete(id);
    updateRoutineCount(); return;
  }
  if (event.target.id === "session-date") { activeDate = event.target.value || todayISO(); expandedId = ensureSession().selected[0] || ""; render(); return; }
  if (event.target.id === "import-file") { if (event.target.files?.[0]) importBackup(event.target.files[0]); event.target.value = ""; return; }
  if (event.target.matches("[data-set-done]")) {
    const set = ensureSession().sets[event.target.dataset.ex]?.find(item => item.id === event.target.dataset.setId);
    if (!set) return;
    const cardio = getExercise(event.target.dataset.ex)?.group === "Cardio";
    if (event.target.checked && cardio && !validCardioSet(getExercise(event.target.dataset.ex), set)) { event.target.checked = false; showToast("Anota los minutos primero"); return; }
    if (event.target.checked && !cardio && (!Number.isInteger(Number(set.reps)) || Number(set.reps) <= 0)) { event.target.checked = false; showToast("Anota las repeticiones primero"); return; }
    delete set.prefilled;
    set.done = event.target.checked;
    set.autoDone = false;
    set.manualDone = true;
    delete ensureSession().completed[event.target.dataset.ex];
    persist(); render();
  }
});
document.addEventListener("click", event => {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;
  catalogFilter = filter.dataset.filter;
  render();
});
document.addEventListener("submit", async event => {
  if (event.target.id === "routine-form") { event.preventDefault(); saveRoutine(); return; }
  if (event.target.id !== "exercise-form") return;
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const id = form.dataset.editId;
    const existing = id ? getExercise(id) : null;
    const file = $("#exercise-photo").files?.[0];
    if (!existing && !file) throw new Error("Falta imagen");
    const image = file ? await resizePhoto(file) : existing?.image;
    const exercise = existing || { id: uid(), tile: null };
    exercise.name = form.elements.name.value.trim();
    exercise.group = form.elements.group.value;
    exercise.equipment = form.elements.equipment.value.trim() || "Equipo no indicado";
    if (image) exercise.image = image;
    if (!existing) state.exercises.push(exercise);
    persist();
    closeOverlay();
    render();
    showToast(existing ? "Ejercicio actualizado" : "Ejercicio añadido");
  } catch (error) {
    console.error(error);
    showToast("No se pudo guardar el ejercicio");
    button.disabled = false;
  }
});
document.addEventListener("keydown", event => { if (event.key === "Escape") closeOverlay(); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") syncSessionDay();
});
window.addEventListener("pageshow", syncSessionDay);
window.addEventListener("focus", syncSessionDay);
// Also cover an app left open across local midnight. Timers resume after suspension.
setInterval(syncSessionDay, 1000);
// Refresh before an interaction can edit yesterday's session after a suspended timer.
for (const eventType of ["click", "input", "change", "submit"]) {
  document.addEventListener(eventType, event => {
    if (syncSessionDay()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}

async function startOfflineImages() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
  let registration, retryTimer;
  const resume = () => {
    clearTimeout(retryTimer);
    (navigator.serviceWorker.controller || registration?.active)?.postMessage({ type: "CACHE_IMAGES" });
  };
  const showStatus = status => {
    const element = $("#offline-images-status");
    if (!element) return;
    if (!["ready", "loading", "paused", "unavailable"].includes(status.phase)) return;
    if (status.phase !== "unavailable" && (!Number.isInteger(status.total) || status.total < 1 || !Number.isInteger(status.completed) || status.completed < 0 || status.completed > status.total)) return;
    if (status.phase === "ready" && status.completed !== status.total) return;
    clearTimeout(retryTimer);
    element.hidden = false;
    element.dataset.state = status.phase;
    element.textContent = status.phase === "ready" && status.completed === status.total
      ? "✓ Imágenes listas sin conexión"
      : status.phase === "unavailable" ? "Descarga de imágenes pendiente. Se reintentará."
      : `${status.phase === "loading" ? "Guardando imágenes" : "Imágenes guardadas"} · ${status.completed}/${status.total}${status.phase === "paused" ? " · Descarga pendiente" : ""}`;
    // Also recover a loading job if the browser suspends its service worker.
    if (status.phase !== "ready") retryTimer = setTimeout(() => {
      if (navigator.onLine !== false && document.visibilityState !== "hidden") resume();
    }, 30000);
  };
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data?.type === "OFFLINE_IMAGES_STATUS") showStatus(event.data);
  });
  navigator.serviceWorker.addEventListener("controllerchange", resume);
  window.addEventListener("online", resume);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") resume(); });
  registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
  await navigator.serviceWorker.ready;
  resume();
  // A denied/unsupported persistence request must not stop downloads or workouts.
  try {
    if (navigator.storage?.persist && !await navigator.storage.persisted?.()) await navigator.storage.persist();
  } catch { /* Browser decides whether storage can be retained persistently. */ }
}

async function init() {
  try {
    db = await openDB();
    state = await readState();
    if (!Array.isArray(state.exercises) || !state.sessions) state = initialState();
    const needsRoutines = !Array.isArray(state.routines);
    if (needsRoutines) state.routines = [];
    const addedExercises = mergeStarterExercises(state);
    const renamedExercises = migrateExerciseNames(state);
    if (addedExercises || renamedExercises || needsRoutines) await writeState(structuredClone(state));
    activeDate = observedToday = todayISO();
    render();
    startOfflineImages().catch(console.warn);
  } catch (error) {
    console.error(error);
    $("#view").innerHTML = `<div class="empty-state"><h2>No se pudo abrir el registro</h2><p>Revisa que el navegador permita guardar datos y vuelve a cargar la página.</p></div>`;
  }
}
init();
