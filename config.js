// �齱ϵͳ���� (�����޸�)
const config = {
    totalNumbers: Array.from({length: 20}, (_, i) => i + 1), // �ܲ�����
    prizes: [
        { name: 'Third Prize', count: 5 },  // ��һ�ֳ�ȡ
        { name: 'Second Prize', count: 3 },  // �ڶ��ֳ�ȡ
        { name: 'First Prize', count: 2 }   // ����ȡ
    ],
    animation: {
        duration: 1500,    // ��������ʱ��(����)
        interval: 100      // ����ˢ�¼��
    }
};