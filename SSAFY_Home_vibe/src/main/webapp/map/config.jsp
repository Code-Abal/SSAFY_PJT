<%-- JSP 상단에서 Java 변수로 선언 --%>
<%
    String REAL_ESTATE_API_BASE_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";
    String REAL_ESTATE_API_SERVICE_KEY = "zdpybI7fG8AAxd8CHouLNvFBJpu4Pky4NfiLgzlYis8sgF%2BvtvuVuurIno9YWCdlqhwkp%2B5jDM98OXkeeWXdKw%3D%3D";
    String REAL_ESTATE_API_SERVICE_NAME = "RTMSDataSvcAptTrade";
    String REAL_ESTATE_API_DATA_TYPE = "xml";

    String LEGAL_DONG_API_BASE_URL = "https://api.vworld.kr/req/data";
    String LEGAL_DONG_API_SERVICE_KEY = "59BAE8AE-F327-37CB-B77F-BE27F65EB72F";
    String LEGAL_DONG_API_SERVICE_NAME = "getLegalDongCode";
    String LEGAL_DONG_API_DATA_TYPE = "json";

    String SIGUNGU_API_BASE_URL = "https://api.vworld.kr/req/data";
    String SIGUNGU_API_SERVICE_KEY = "E55FF646-C2F9-3913-8AAE-E37D5E0B90B9";
    String SIGUNGU_API_SERVICE_NAME = "getSigunguCode";
    String SIGUNGU_API_DATA_TYPE = "json";

    String DONG_API_BASE_URL = "https://api.vworld.kr/req/data";
    String DONG_API_SERVICE_KEY = "4C2B21B2-5708-366B-BA9C-B109E695CE37";
    String DONG_API_SERVICE_NAME = "getDongCode";
    String DONG_API_DATA_TYPE = "json";

    String RESPONSE_TYPE = "json";
    int PAGE_SIZE = 100;
    boolean USE_PROXY = false;
%>

<script>
    // JSP 변수를 JS 변수로 전달
    const API_CONFIG = {
        REAL_ESTATE_API: {
            BASE_URL: "<%= REAL_ESTATE_API_BASE_URL %>",
            SERVICE_KEY: "<%= REAL_ESTATE_API_SERVICE_KEY %>",
            SERVICE_NAME: "<%= REAL_ESTATE_API_SERVICE_NAME %>",
            DATA_TYPE: "<%= REAL_ESTATE_API_DATA_TYPE %>"
        },
        LEGAL_DONG_API: {
            BASE_URL: "<%= LEGAL_DONG_API_BASE_URL %>",
            SERVICE_KEY: "<%= LEGAL_DONG_API_SERVICE_KEY %>",
            SERVICE_NAME: "<%= LEGAL_DONG_API_SERVICE_NAME %>",
            DATA_TYPE: "<%= LEGAL_DONG_API_DATA_TYPE %>"
        },
        SIGUNGU_API: {
            BASE_URL: "<%= SIGUNGU_API_BASE_URL %>",
            SERVICE_KEY: "<%= SIGUNGU_API_SERVICE_KEY %>",
            SERVICE_NAME: "<%= SIGUNGU_API_SERVICE_NAME %>",
            DATA_TYPE: "<%= SIGUNGU_API_DATA_TYPE %>"
        },
        DONG_API: {
            BASE_URL: "<%= DONG_API_BASE_URL %>",
            SERVICE_KEY: "<%= DONG_API_SERVICE_KEY %>",
            SERVICE_NAME: "<%= DONG_API_SERVICE_NAME %>",
            DATA_TYPE: "<%= DONG_API_DATA_TYPE %>"
        },
        RESPONSE_TYPE: "<%= RESPONSE_TYPE %>",
        PAGE_SIZE: <%= PAGE_SIZE %>,
        USE_PROXY: <%= USE_PROXY %>
    };
    window.API_CONFIG = API_CONFIG;
</script>