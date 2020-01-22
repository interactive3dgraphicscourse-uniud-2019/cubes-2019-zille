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

Visto che la heightmap da 384x384 era troppo grande (gli FPS frame erano di molto sotto ai 60), ho rifatto la heightmap simulando un terreno collinare con una dimensione di 128x128, decisamente più appropriata allo scopo, riportando gli FPS a 60.

## 17.01.2020
Aggiunte le "case", le "strade" e degli "abitanti" che saltellano da un capo punto all'altro di una strada passando da una casa all'altra.

## 18.01.2020
Migliorata la creazione del terreno per non "occupare" gli spazi dove viene tracciata una strada.
Aggiunta una "giostra".

## 19.01.2020
Impostata una environment map per gestire le riflessioni della giostra che è stata impostata per avere un materiale metallico.
Impostato un materiale plastico per gli abitanti e fatto modo che si muovino e saltellino a velocità diverse.
Abilitato la rotazione automatica della telecamera per mostrare la scena da ogni angolo.
Debuggato una diminuzione degli FPS solamente quando la telecamera è rivolta in direzione circa da (0, 0, -1) a (1, 0, 0). Questo sembra sia causato dalla combinazione del terreno (che è composto da molti vertici) e dall'acqua del fiume che in quei punti risulta più visibile (sembra quindi che il fragment shader dell'acqua sia il collo di bottiglia, come prevedibile vista la complessità).
Eliminando il fiume non ci sarebbe questo porblema di calo degli FPS, però la scena ne perderebbe di qualtà quindi ho deciso di lasciare l'acqua, in fin dei conti gli FPS passano da 60 a circa 45, una differenza notabile soprattuto nelle animazioni e nel movimento della telecamera che perà restano ancora accettabili.

## 22.01.2020
Aggiunta animazione inziale di caricamento della scena.

## Considerazioni finali
La scena non è risultata troppo complessa da costruire, la difficoltà maggiore è stata far rimanere gli abitanti all'interno delle loro strade.
Dopo aver completato la scena però è emerso un problema per quanto riguarda le performance in quanto abbastanza scarse. Questo problema è dovuto soprattutto a due fattori: lo shader dell'acqua che risulta indubbiamente costoso per la GPU ed il numero di mesh che risulta abbastanza elevato, soprattutto per quanto riguarda il terreno e le case. Questi due infatti sono costruiti da una serie di cubi che a loro volta sono stati scomposti in 6 divesi piani (uno per ogni faccia) in modo da poter gestire un materiale diverso per ogni faccia, necessario per i cubi che hanno l'erba nella parte superiore e ai lati. Ho anche fatto una prova utilizzando una singola BoxGeometry al posto di 6 PlaneGeometry ma il risultato non è cambiato (ho lasciato attiva la gestione la la singola BoxGeometry). Evidentemente, come anche già supponevo dall'inizio, questo non è il metodo corretto di gestire le mesh in una scenza quasi interamente composta da cubi in questa è molto più efficace utilizzare tecniche come l'instancing oppure la voxelization, in modo da ridurre al minimo i dati da processare.