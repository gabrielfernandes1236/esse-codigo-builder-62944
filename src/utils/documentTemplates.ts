
export const professionalTemplates = {
  'procuracao': `
    <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 20px;">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iIzFhMzY1ZCIvPgo8cGF0aCBkPSJNMTUgMjBIMzBWMzVIMTVWMjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0zNSAyMEg0NVYzNUgzNVYyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTIwIDQwSDQwVjQ1SDIwVjQwWiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K" alt="Logo Oliveira & Associados" style="width: 60px; height: 60px;" />
        <div>
          <h2 style="margin: 0; color: #1a365d; font-size: 18pt;">OLIVEIRA & ASSOCIADOS ADVOCACIA</h2>
          <p style="margin: 5px 0; font-size: 10pt;">Dr. Ricardo Oliveira - OAB/SP 123.456</p>
          <p style="margin: 5px 0; font-size: 10pt;">Rua dos Advogados, 456 - Centro - São Paulo - SP - CEP: 01234-567</p>
          <p style="margin: 5px 0; font-size: 10pt;">Tel: (11) 3456-7890 | Email: contato@oliveiraadvocacia.com.br</p>
        </div>
      </div>
      
      <h1 style="text-align: center; margin: 30px 0; font-size: 16pt; text-decoration: underline;">PROCURAÇÃO</h1>
      
      <p style="text-align: justify; margin-bottom: 15px;">
        Eu, <strong>{{Cliente}}</strong>, {{Nacionalidade}}, {{EstadoCivil}}, 
        portador(a) do {{TipoDocumento}} nº <strong>{{CPF_CNPJ}}</strong>, 
        residente e domiciliado(a) à {{Endereco}}, pelo presente instrumento de mandato, 
        <strong>NOMEIO E CONSTITUO</strong> como meu(s) bastante(s) procurador(es) o(a) advogado(a) 
        <strong>{{Advogado}}</strong>, inscrito(a) na OAB/{{UF}} sob o nº <strong>{{OAB}}</strong>, 
        com escritório profissional localizado à {{EnderecoAdvogado}}, a quem confiro os seguintes poderes:
      </p>
      
      <div style="margin: 20px 0;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">PODERES CONFERIDOS:</h3>
        <ul style="margin-left: 20px; line-height: 1.8;">
          <li>Representar-me perante quaisquer órgãos públicos, repartições, tribunais e juízos;</li>
          <li>Propor, acompanhar e defender ações judiciais de qualquer natureza;</li>
          <li>Requerer certidões, documentos e informações;</li>
          <li>Prestar declarações e assumir compromissos;</li>
          <li>Assinar contratos, escrituras e documentos em meu nome;</li>
          <li>Receber e dar quitação;</li>
          <li>Transigir, desistir, renunciar e fazer acordos;</li>
          <li>Substabelecer com ou sem reservas de iguais poderes;</li>
          <li>Praticar todos os atos necessários ao bom e fiel desempenho do presente mandato.</li>
        </ul>
      </div>
      
      <p style="text-align: justify; margin: 20px 0;">
        Por ser verdade, firmo a presente procuração.
      </p>
      
      <div style="margin-top: 50px; text-align: center;">
        <p><strong>{{Cidade}}</strong>, {{Data}}.</p>
        
        <div style="margin-top: 60px;">
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; text-align: center;">
            <p style="margin-top: 5px;"><strong>{{Cliente}}</strong></p>
            <p style="margin: 0; font-size: 10pt;">{{TipoDocumento}}: {{CPF_CNPJ}}</p>
          </div>
        </div>
      </div>
    </div>
  `,

  'contrato-prestacao': `
    <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 20px;">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iIzFhMzY1ZCIvPgo8cGF0aCBkPSJNMTUgMjBIMzBWMzVIMTVWMjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0zNSAyMEg0NVYzNUgzNVYyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTIwIDQwSDQwVjQ1SDIwVjQwWiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K" alt="Logo Oliveira & Associados" style="width: 60px; height: 60px;" />
        <div>
          <h2 style="margin: 0; color: #1a365d; font-size: 18pt;">OLIVEIRA & ASSOCIADOS ADVOCACIA</h2>
          <p style="margin: 5px 0; font-size: 10pt;">Dr. Ricardo Oliveira - OAB/SP 123.456</p>
          <p style="margin: 5px 0; font-size: 10pt;">Rua dos Advogados, 456 - Centro - São Paulo - SP - CEP: 01234-567</p>
          <p style="margin: 5px 0; font-size: 10pt;">Tel: (11) 3456-7890 | Email: contato@oliveiraadvocacia.com.br</p>
        </div>
      </div>
      
      <h1 style="text-align: center; margin: 30px 0; font-size: 16pt; text-decoration: underline;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS</h1>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CONTRATANTE:</h3>
        <p style="margin-left: 20px; text-align: justify;">
          <strong>{{Cliente}}</strong>, {{TipoPessoa}}, inscrito(a) no {{TipoDocumento}} sob o nº <strong>{{CPF_CNPJ}}</strong>, 
          residente e domiciliado(a) à {{Endereco}}.
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CONTRATADO:</h3>
        <p style="margin-left: 20px; text-align: justify;">
          <strong>{{Advogado}}</strong>, advogado(a), inscrito(a) na OAB/{{UF}} sob o nº <strong>{{OAB}}</strong>, 
          com escritório profissional localizado à {{EnderecoAdvogado}}.
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CLÁUSULA 1ª - DO OBJETO:</h3>
        <p style="margin-left: 20px; text-align: justify;">
          O presente contrato tem por objeto a prestação de serviços jurídicos relacionados a <strong>{{ObjetoContrato}}</strong>, 
          incluindo consultoria, elaboração de documentos, representação judicial e extrajudicial.
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CLÁUSULA 2ª - DOS HONORÁRIOS:</h3>
        <p style="margin-left: 20px; text-align: justify;">
          Os honorários advocatícios são fixados em <strong>R$ {{ValorHonorarios}}</strong>, 
          a serem pagos da seguinte forma: {{FormaPagamento}}.
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CLÁUSULA 3ª - DO PRAZO:</h3>
        <p style="margin-left: 20px; text-align: justify;">
          O presente contrato tem vigência a partir de <strong>{{Data}}</strong> e permanecerá em vigor até a conclusão dos serviços contratados.
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12pt; margin-bottom: 10px;">CLÁUSULA 4ª - DAS OBRIGAÇÕES DO CONTRATADO:</h3>
        <ul style="margin-left: 40px; line-height: 1.8;">
          <li>Prestar os serviços com diligência, competência e confidencialidade;</li>
          <li>Manter sigilo profissional sobre todas as informações;</li>
          <li>Informar periodicamente sobre o andamento dos trabalhos;</li>
          <li>Cumprir os prazos estabelecidos;</li>
          <li>Representar os interesses do contratante com zelo e dedicação.</li>
        </ul>
      </div>
      
      <p style="text-align: justify; margin: 30px 0;">
        E por estarem justos e contratados, assinam o presente instrumento em duas vias de igual teor.
      </p>
      
      <div style="margin-top: 50px; text-align: center;">
        <p><strong>{{Cidade}}</strong>, {{Data}}.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 60px;">
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid #000; padding-top: 5px;">
              <p><strong>{{Cliente}}</strong></p>
              <p style="font-size: 10pt;">CONTRATANTE</p>
              <p style="font-size: 10pt;">{{TipoDocumento}}: {{CPF_CNPJ}}</p>
            </div>
          </div>
          <div style="text-align: center; width: 45%;">
            <div style="border-top: 1px solid #000; padding-top: 5px;">
              <p><strong>{{Advogado}}</strong></p>
              <p style="font-size: 10pt;">CONTRATADO</p>
              <p style="font-size: 10pt;">OAB/{{UF}}: {{OAB}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  'peticao-inicial': `
    <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 20px;">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iIzFhMzY1ZCIvPgo8cGF0aCBkPSJNMTUgMjBIMzBWMzVIMTVWMjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0zNSAyMEg0NVYzNUgzNVYyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTIwIDQwSDQwVjQ1SDIwVjQwWiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K" alt="Logo Oliveira & Associados" style="width: 60px; height: 60px;" />
        <div>
          <h2 style="margin: 0; color: #1a365d; font-size: 18pt;">OLIVEIRA & ASSOCIADOS ADVOCACIA</h2>
          <p style="margin: 5px 0; font-size: 10pt;">Dr. Ricardo Oliveira - OAB/SP 123.456</p>
        </div>
      </div>
      
      <div style="text-align: right; margin-bottom: 30px;">
        <p style="margin: 0;">Excelentíssimo(a) Senhor(a) Doutor(a)</p>
        <p style="margin: 0;">Juiz(a) de Direito da {{Vara}}</p>
        <p style="margin: 0;">{{Cidade}}/{{UF}}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="text-align: justify;">
          <strong>{{Cliente}}</strong>, {{Qualificacao}}, inscrito(a) no {{TipoDocumento}} sob o nº <strong>{{CPF_CNPJ}}</strong>, 
          residente e domiciliado(a) à {{Endereco}}, por intermédio de seu advogado que esta subscreve 
          (OAB/{{UF}} {{OAB}}), vem respeitosamente à presença de Vossa Excelência propor a presente
        </p>
        
        <h1 style="text-align: center; margin: 20px 0; font-size: 16pt; text-decoration: underline;">{{TipoAcao}}</h1>
        
        <p style="text-align: justify;">
          em face de <strong>{{Reu}}</strong>, {{QualificacaoReu}}, pelos fatos e fundamentos jurídicos a seguir expostos:
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; text-align: center; margin-bottom: 15px;">I - DOS FATOS</h2>
        <div style="text-align: justify; margin-left: 20px;">
          {{RelatoFatos}}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; text-align: center; margin-bottom: 15px;">II - DO DIREITO</h2>
        <div style="text-align: justify; margin-left: 20px;">
          {{FundamentosJuridicos}}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; text-align: center; margin-bottom: 15px;">III - DOS PEDIDOS</h2>
        <p style="text-align: justify; margin-left: 20px;">
          Diante do exposto, requer-se a Vossa Excelência:
        </p>
        <ol style="margin-left: 40px; line-height: 1.8; text-align: justify;">
          <li>{{Pedido1}};</li>
          <li>{{Pedido2}};</li>
          <li>A condenação da parte requerida ao pagamento das custas processuais e honorários advocatícios;</li>
          <li>A produção de todos os meios de prova em direito admitidos.</li>
        </ol>
      </div>
      
      <p style="text-align: justify; margin: 20px 0;">
        Protesta-se por todos os meios de prova em direito admitidos, especialmente prova documental, testemunhal e pericial.
      </p>
      
      <p style="text-align: justify; margin: 20px 0;">
        Dá-se à causa o valor de <strong>R$ {{ValorCausa}}</strong>.
      </p>
      
      <p style="text-align: justify; margin: 20px 0;">
        Termos em que pede deferimento.
      </p>
      
      <div style="margin-top: 50px; text-align: center;">
        <p><strong>{{Cidade}}</strong>, {{Data}}.</p>
        
        <div style="margin-top: 60px; text-align: center;">
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 5px;">
            <p><strong>{{Advogado}}</strong></p>
            <p style="font-size: 10pt;">OAB/{{UF}} {{OAB}}</p>
          </div>
        </div>
      </div>
    </div>
  `,

  'parecer-juridico': `
    <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 20px;">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iIzFhMzY1ZCIvPgo8cGF0aCBkPSJNMTUgMjBIMzBWMzVIMTVWMjBaIiBmaWxsPSIjZmZmZmZmIi8+CjxwYXRoIGQ9Ik0zNSAyMEg0NVYzNUgzNVYyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTIwIDQwSDQwVjQ1SDIwVjQwWiIgZmlsbD0iI2ZmZmZmZiIvPgo8L3N2Zz4K" alt="Logo Oliveira & Associados" style="width: 60px; height: 60px;" />
        <div>
          <h2 style="margin: 0; color: #1a365d; font-size: 18pt;">OLIVEIRA & ASSOCIADOS ADVOCACIA</h2>
          <p style="margin: 5px 0; font-size: 10pt;">Dr. Ricardo Oliveira - OAB/SP 123.456</p>
          <p style="margin: 5px 0; font-size: 10pt;">Rua dos Advogados, 456 - Centro - São Paulo - SP - CEP: 01234-567</p>
          <p style="margin: 5px 0; font-size: 10pt;">Tel: (11) 3456-7890 | Email: contato@oliveiraadvocacia.com.br</p>
        </div>
      </div>
      
      <h1 style="text-align: center; margin: 30px 0; font-size: 16pt; text-decoration: underline;">PARECER JURÍDICO</h1>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; margin-bottom: 15px;">1. DA CONSULTA</h2>
        <p style="text-align: justify; margin-left: 20px;">
          Foi-me solicitado parecer jurídico sobre <strong>{{AssuntoParecer}}</strong>, envolvendo 
          <strong>{{Cliente}}</strong>, {{TipoPessoa}}, inscrito(a) no {{TipoDocumento}} sob o nº <strong>{{CPF_CNPJ}}</strong>.
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; margin-bottom: 15px;">2. DO RELATÓRIO DOS FATOS</h2>
        <div style="text-align: justify; margin-left: 20px;">
          {{RelatorioFatos}}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; margin-bottom: 15px;">3. DA FUNDAMENTAÇÃO JURÍDICA</h2>
        <div style="text-align: justify; margin-left: 20px;">
          {{FundamentacaoJuridica}}
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; margin-bottom: 15px;">4. DA ANÁLISE LEGAL</h2>
        <p style="text-align: justify; margin-left: 20px;">
          Com base na legislação vigente e na jurisprudência consolidada, verifica-se que o caso em análise 
          apresenta aspectos que merecem consideração detalhada sob o prisma jurídico.
        </p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 12pt; margin-bottom: 15px;">5. DA CONCLUSÃO</h2>
        <div style="text-align: justify; margin-left: 20px;">
          {{Conclusao}}
        </div>
      </div>
      
      <p style="text-align: justify; margin: 30px 0;">
        É o parecer, <em>sub censura</em>.
      </p>
      
      <div style="margin-top: 50px; text-align: center;">
        <p><strong>{{Cidade}}</strong>, {{Data}}.</p>
        
        <div style="margin-top: 60px; text-align: center;">
          <div style="border-top: 1px solid #000; width: 300px; margin: 0 auto; padding-top: 5px;">
            <p><strong>{{Advogado}}</strong></p>
            <p style="font-size: 10pt;">OAB/{{UF}} {{OAB}}</p>
          </div>
        </div>
      </div>
    </div>
  `
};
