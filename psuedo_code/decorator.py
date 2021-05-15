// A interface componente define operações que podem ser
// alteradas por decoradores.
interface DataSource is
    method writeData(data)
    method readData():data

// Componentes concretos fornecem uma implementação padrão para
// as operações. Pode haver diversas variações dessas classes em
// um programa.
class FileDataSource implements DataSource is
    constructor FileDataSource(filename) { ... }

    method writeData(data) is
        // Escreve dados no arquivo.

    method readData():data is
        // Lê dados de um arquivo.

// A classe decorador base segue a mesma interface que os outros
// componentes. O propósito primário dessa classe é definir a
// interface que envolve todos os decoradores concretos. A
// implementação padrão do código de envolvimento pode também
// incluir um campo para armazenar um componente envolvido e os
// meios para inicializá-lo.
class DataSourceDecorator implements DataSource is
    protected field wrappee: DataSource

    constructor DataSourceDecorator(source: DataSource) is
        wrappee = source

    // O decorador base simplesmente delega todo o trabalho para
    // a o componente envolvido. Comportamentos extra podem ser
    // adicionados em decoradores concretos.
    method writeData(data) is
        wrappee.writeData(data)

    // Decoradores concretos podem chamar a implementação pai da
    // operação ao invés de chamar o objeto envolvido
    // diretamente. Essa abordagem simplifica a extensão de
    // classes decorador.
    method readData():data is
        return wrappee.readData()

// Decoradores concretos devem chamar métodos no objeto
// envolvido, mas podem adicionar algo próprio para o resultado.
// Os decoradores podem executar o comportamento adicional tanto
// antes como depois da chamada ao objeto envolvido.
class EncryptionDecorator extends DataSourceDecorator is
    method writeData(data) is
        // 1. Encriptar os dados passados.
        // 2. Passar dados encriptados para o método writeData
        // do objeto envolvido.

    method readData():data is
        // 1. Obter os dados do método readData do objeto
        // envolvido.
        // 2. Tentar decifrá-lo se for encriptado.
        // 3. Retornar o resultado.

// Você pode envolver objetos em diversas camadas de
// decoradores.
class CompressionDecorator extends DataSourceDecorator is
    method writeData(data) is
        // 1. Comprimir os dados passados.
        // 2. Passar os dados comprimidos para o método
        // writeData do objeto envolvido.

    method readData():data is
        // 1. Obter dados do método readData do objeto
        // envolvido.
        // 2. Tentar descomprimi-lo se for comprimido.
        // 3. Retornar o resultado.

// Opção 1. Um exemplo simples de uma montagem decorador.
class Application is
    method dumbUsageExample() is
        source = new FileDataSource("somefile.dat")
        source.writeData(salaryRecords)
        // O arquivo alvo foi escrito com dados simples.

        source = new CompressionDecorator(source)
        source.writeData(salaryRecords)
        // O arquivo alvo foi escrito com dados comprimidos.

        source = new EncryptionDecorator(source)
        // A variável fonte agora contém isso:
        // Encryption > Compression > FileDataSource
        source.writeData(salaryRecords)
        // O arquivo foi escrito com dados comprimidos e
        // encriptados.


// Opção 2. Código cliente que usa uma fonte de dados externa.
// Objetos SalaryManager não sabem e nem se importam sobre as
// especificações de armazenamento de dados. Eles trabalham com
// uma fonte de dados pré configurada recebida pelo configurador
// da aplicação.
class SalaryManager is
    field source: DataSource

    constructor SalaryManager(source: DataSource) { ... }

    method load() is
        return source.readData()

    method save() is
        source.writeData(salaryRecords)
    // ...Outros métodos úteis...


// A aplicação pode montar diferentes pilhas de decoradores no
// tempo de execução, dependendo da configuração ou ambiente.
class ApplicationConfigurator is
    method configurationExample() is
        source = new FileDataSource("salary.dat")
        if (enabledEncryption)
            source = new EncryptionDecorator(source)
        if (enabledCompression)
            source = new CompressionDecorator(source)

        logger = new SalaryManager(source)
        salary = logger.load()
    // ...