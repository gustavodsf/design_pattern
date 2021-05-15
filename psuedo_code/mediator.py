// A interface mediadora declara um método usado pelos
// componentes para notificar o mediador sobre vários eventos. O
// mediador pode reagir a esses eventos e passar a execução para
// outros componentes.
interface Mediator is
    method notify(sender: Component, event: string)


// A classe mediadora concreta. A rede entrelaçada de conexões
// entre componentes individuais foi desentrelaçada e movida
// para dentro do mediador.
class AuthenticationDialog implements Mediator is
    private field title: string
    private field loginOrRegisterChkBx: Checkbox
    private field loginUsername, loginPassword: Textbox
    private field registrationUsername, registrationPassword,
                  registrationEmail: Textbox
    private field okBtn, cancelBtn: Button

    constructor AuthenticationDialog() is
        // Cria todos os objetos componentes e passa o atual
        // mediador em seus construtores para estabelecer links.

    // Quando algo acontece com um componente, ele notifica o
    // mediador. Ao receber a notificação, o mediador pode fazer
    // alguma coisa por conta própria ou passar o pedido para
    // outro componente.
    method notify(sender, event) is
        if (sender == loginOrRegisterChkBx and event == "check")
            if (loginOrRegisterChkBx.checked)
                title = "Log in"
                // 1. Mostra componentes de formulário de login.
                // 2. Esconde componentes de formulário de
                // registro.
            else
                title = "Register"
                // 1. Mostra componentes de formulário de
                // registro.
                // 2. Esconde componentes de formulário de
                // login.
        if (sender == okBtn && event == "click")
            if (loginOrRegister.checked)
                // Tenta encontrar um usuário usando as
                // credenciais de login.
                if (!found)
                    // Mostra uma mensagem de erro acima do
                    // campo login.
            else
                // 1. Cria uma conta de usuário usando dados dos
                // campos de registro.
                // 2. Loga aquele usuário.
                // ...

// Os componentes se comunicam com o mediador usando a interface
// do mediador. Graças a isso, você pode usar os mesmos
// componentes em outros contextos ao ligá-los com diferentes
// objetos mediadores.
class Component is
    field dialog: Mediator

    constructor Component(dialog) is
        this.dialog = dialog

    method click() is
        dialog.notify(this, "click")

    method keypress() is
        dialog.notify(this, "keypress")

// Componentes concretos não falam entre si. Eles têm apenas um
// canal de comunicação, que é enviar notificações para o
// mediador.
class Button extends Component is
    // ...

class Textbox extends Component is
    // ...

class Checkbox extends Component is
    method check() is
        dialog.notify(this, "check")
    // ...