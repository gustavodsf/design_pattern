// O originador tem alguns dados importantes que podem mudar com
// o tempo. Ele também define um método para salvar seu estado
// dentro de um memento e outro método para restaurar o estado
// dele.
class Editor is
    private field backup: Queue<Snapshot>
    private field text, curX, curY, selectionWidth

    method setText(text) is
        this.text = text

    method setCursor(curX, curY) is
        this.curX = curX
        this.curY = curY

    method setSelectionWidth(width) is
        this.selectionWidth = width

    // Salva o estado atual dentro de um memento.
    method createSnapshot():Boolean is
        try 
            Snapshot snap = new Snapshot(this, text, curX, curY, selectionWidth)
            backup.push(snap)
            // O memento é um objeto imutável; é por isso que o
            // originador passa seu estado para os parâmetros do
            // construtor do memento.
            return true;
        catch(e)
            return false;

    method undo():
        if (backup != null)  
            backup.pop().restore(); 

// A classe memento armazena o estado anterior do editor.
class Snapshot is
    private field editor: Editor
    private field text, curX, curY, selectionWidth

    constructor Snapshot(editor, text, curX, curY, selectionWidth) is
        this.editor = editor
        this.text = text
        this.curX = curX
        this.curY = curY
        this.selectionWidth = selectionWidth

    // Em algum momento, um estado anterior do editor pode ser
    // restaurado usando um objeto memento.
    method restore() is
        editor.setText(text)
        editor.setCursor(curX, curY)
        editor.setSelectionWidth(selectionWidth)

// Um objeto comando pode agir como cuidador. Neste caso, o
// comando obtém o memento antes que ele mude o estado do
// originador. Quando o undo(desfazer) é solicitado, ele
// restaura o estado do originador a partir de um memento.
class Command is
    private field editor: Editor
    
    method makeBackup() is
        editor.createSnapshot();

    method undo() is 
        editor.undo()