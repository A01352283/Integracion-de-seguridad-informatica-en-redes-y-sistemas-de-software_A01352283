import clientPromise from "../lib/mongodb";

export default function Expedientes({ expedientes }) {
    return (
        <div>
            <h1>Expedientes AO</h1>
            <ul>
                {expedientes.map((expediente) => (
                    <li>
                        <h2>Numero de expediente: {expediente.numExp}</h2>
                        <h3>Titulo: {expediente.tituloExpediente}</h3>
                        <p>Fecha de apertura: {expediente.apertura}</p>
                        <h3>Documentos: </h3>
                        
                        {expediente.documentos.map((documento) => (
                            <li>
                                <p>Num Folio: {documento.numFolio}</p>
                                <p>Path: {documento.path}</p>
                                <p>Fecha de alta: {documento.fecha}</p>
                            </li>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise; // Our handler function implementation calls the clientPromise function to get the instance of our MongoDB database. 
        const db = client.db("baseAO");

        const expedientes = await db
            .collection("documentos")
            .find({})
            .toArray();

        return {
            props: { expedientes: JSON.parse(JSON.stringify(expedientes)) },
        };
    } catch (e) {
        console.error(e);
    }
}