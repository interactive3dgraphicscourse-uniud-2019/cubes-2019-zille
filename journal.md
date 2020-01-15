## 12.01.2020
Inizialmente avevo pensato di creare un modello del sistema solare andando ad aggiungere anche i vari satelliti dei vari pianeti. Successvamente avrei aggiunto la rotazione dei satelliti attorno ai pianeti e la rotazione dei pianeti attorno ai satelliti.
Questa idea si è però rivelata più lunga del previsto in quanto non avrei avuto modo di aggiungerci un terreno, non avrebbe avuto senso, e la creazione di un video avrebbe richiesto troppo tempo per essere fatta bene.
Ho deciso quindi di procedere alla creazione di una scena stile Minecraft, creando una texture da utilizzare come heightmap per generare il terreno che sarebbe stato composto da delle montagne e una vallata nella quale andrò ad inserire una specie di cinta muraria castello con delle guardie che ci camminano sopra. All'interno di queste mura andrò poi ad aggiungere delle case e degli abitanti che si sposteranno da una casa all'altra secondo dei percorsi prestabiliti.

Al termine del primo giorno ho finito di preparare il layout della heightmap in modo da simulare la gola di una montagna ed iniziato a lavorare sulla creazione del terreno, la quale presenta ancora qualche bug nel riempimento dei buchi nei vari livelli.

NB: è stata aggiornata la versione di ThreeJS all'ultima disponibile ed anche i relativi moduli (Orbit, Stats, ecc) che erano stati messi a disposizione.

## 14.01.2020
Corretti i bug di caricamento della heightmap che lasciavano dei buchi durante lo riempimento degli spazi tra un livello ed un altro.

## 15.01.2020
Gestita la creazione dell'acqua (il fiume) quando il livello della heightmap è minore di 0.