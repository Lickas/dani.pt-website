import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { newsletterAPI } from '../utils/apiService';

const PrivacyPolicy = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleUnsubscribe = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error('Por favor, introduza o seu email.');
            return;
        }

        setLoading(true);
        setResult(null);
        
        try {
            const response = await newsletterAPI.unsubscribe(email);
            setResult(response);
            
            if (response.found) {
                toast.success(response.message);
                setEmail('');
            } else {
                toast.info(response.message);
            }
        } catch (error) {
            console.error('Unsubscribe error:', error);
            toast.error('Ocorreu um erro. Tente novamente.');
            setResult({ message: 'Ocorreu um erro. Tente novamente.', found: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#111]">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-[#222]">
                <div className="container-site py-12">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E60000] mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao início
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E60000] rounded-sm flex items-center justify-center">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl text-gray-900 dark:text-white">
                                Política de Privacidade
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                Última atualização: Janeiro 2025
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-site py-12 md:py-16">
                <div className="max-w-3xl mx-auto">
                    
                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            1. Introdução
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            A dANI.PT está comprometida em proteger a sua privacidade. Esta Política de Privacidade 
                            explica como recolhemos, utilizamos e protegemos as suas informações pessoais quando 
                            utiliza o meu website.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            2. Dados que Recolhemos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Podemos recolher os seguintes tipos de informação:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                            <li><strong className="text-gray-900 dark:text-white">Dados de contacto:</strong> Nome, email, telefone (fornecidos através de formulários)</li>
                            <li><strong className="text-gray-900 dark:text-white">Dados de navegação:</strong> Páginas visitadas, tempo de permanência, tipo de browser</li>
                            <li><strong className="text-gray-900 dark:text-white">Newsletter:</strong> Endereço de email para envio de comunicações</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            3. Como Utilizamos os Dados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Os seus dados são utilizados para:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• Responder às suas questões e pedidos de informação</li>
                            <li>• Enviar newsletters e comunicações sobre novos veículos e campanhas</li>
                            <li>• Melhorar a experiência de utilização do website</li>
                            <li>• Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            4. Base Legal
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            O tratamento dos seus dados pessoais baseia-se em:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• <strong className="text-gray-900 dark:text-white">Consentimento:</strong> Para o envio de newsletters</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Interesse legítimo:</strong> Para responder a pedidos de contacto</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Obrigação legal:</strong> Para cumprimento de requisitos legais</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            5. Partilha de Dados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Não vendemos nem partilhamos os seus dados pessoais com terceiros para fins de marketing. 
                            Os seus dados podem ser partilhados apenas com:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 mt-4 space-y-2">
                            <li>• Prestadores de serviços que nos auxiliam na operação do website</li>
                            <li>• Autoridades competentes quando exigido por lei</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            6. Segurança dos Dados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
                            os seus dados pessoais contra acesso não autorizado, perda ou destruição. Utilizamos 
                            encriptação SSL/TLS para proteger a transmissão de dados.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            7. Retenção de Dados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Conservamos os seus dados pessoais apenas pelo tempo necessário para as finalidades 
                            para as quais foram recolhidos, ou conforme exigido por lei. Os dados de newsletter 
                            são mantidos até que cancele a sua subscrição.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            8. Os Seus Direitos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Ao abrigo do RGPD, tem os seguintes direitos:
                        </p>
                        <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong className="text-gray-900 dark:text-white">Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Apagamento:</strong> Solicitar a eliminação dos seus dados</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Oposição:</strong> Opor-se ao tratamento dos seus dados</li>
                            <li>• <strong className="text-gray-900 dark:text-white">Portabilidade:</strong> Receber os seus dados em formato estruturado</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            Para exercer estes direitos, contacte-nos através do email: rgpd@leandroxws.dev
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            9. Cookies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            O meu website utiliza cookies essenciais para o seu funcionamento. Cookies são 
                            pequenos ficheiros armazenados no seu dispositivo que nos permitem melhorar a sua 
                            experiência de navegação. Pode configurar o seu browser para recusar cookies, 
                            embora isso possa afetar algumas funcionalidades do website.
                        </p>
                    </section>

                    {/* Newsletter Unsubscribe Section */}
                    <section className="mb-10" id="cancelar-newsletter">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            10. Cancelar Subscrição da Newsletter
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            Se pretende deixar de receber a minha newsletter, introduza o seu email abaixo. 
                            A sua subscrição será cancelada imediatamente.
                        </p>
                        
                        <div className="p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-sm border border-gray-100 dark:border-[#333]">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail size={20} className="text-[#E60000]" />
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Cancelar Subscrição
                                </h3>
                            </div>
                            
                            <form onSubmit={handleUnsubscribe} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Introduza o seu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#444] rounded-sm text-sm outline-none focus:border-[#E60000] dark:focus:border-[#E60000] transition-colors"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white dark:text-gray-900 font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>A processar...</span>
                                        </>
                                    ) : (
                                        <span>Cancelar Subscrição</span>
                                    )}
                                </button>
                            </form>

                            {result && (
                                <div className={`mt-4 p-4 rounded-sm flex items-start gap-3 ${
                                    result.found 
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                                        : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                                }`}>
                                    {result.found ? (
                                        <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm">{result.message}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            11. Alterações à Política
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer alterações 
                            serão publicadas nesta página com a data de atualização. Recomendamos que consulte 
                            esta página regularmente.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            12. Contacto
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Para questões relacionadas com esta Política de Privacidade ou para exercer os seus 
                            direitos de proteção de dados, contacte-nos:
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-sm">
                            <p className="text-gray-900 dark:text-white font-medium">dANI.PT - Stand Automóvel</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Email: daniel.henriques@rodda.pt</p>
                            <p className="text-gray-600 dark:text-gray-400">Telefone: +351 919 190 993</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-xl text-gray-900 dark:text-white mb-4">
                            13. Autoridade de Controlo
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Se considerar que o tratamento dos seus dados pessoais viola a legislação de 
                            proteção de dados, tem o direito de apresentar uma reclamação junto da 
                            Comissão Nacional de Proteção de Dados (CNPD).
                        </p>
                        <div className="mt-4 p-6 bg-gray-50 dark:bg-[#1A1A1A] rounded-sm">
                            <p className="text-gray-900 dark:text-white font-medium">CNPD - Comissão Nacional de Proteção de Dados</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Website: www.cnpd.pt</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
