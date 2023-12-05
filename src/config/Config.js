import WidgetAjax from './../widget/WidgetAjax';

export default class Config 
{
    static getBasePath() 
    {
        // const basePath = "http://218.26.73.117:18080/ThalassaAPI";

        const basePath = "http://218.26.73.114:18121/LarissaEntityInvestmentAPI";

        // const basePath = "http://218.26.73.117:18081/PorosAPI";
        
        return basePath;
    }

    static loginPath()
    {
        const basePath = 'http://218.26.73.114:18121/LarissaEntityInvestmentAPI'
        // const basePath = 'http://218.26.73.114:18081/PorosAPI'
        // const basePath = 'http://218.26.73.114:18081/ProteusAPI'

        return basePath;
    }

    static getDBID()
    {
        const DBID = undefined;
        return DBID;
    }

    static getMapName() 
    {
        return "110105";
    }

    static getEncryptyType() 
    {
        return "MD5";
    }

    static isShowHeaderArea() 
    {
        return false;
    }

    static getSystemTitle() 
    {
        return "精准招商大屏";
    }

    static getSystemType()
    {
        return "sso"; // 线上
        // return "local"; // 线下
    }

    static getHermesPanoramaUID()
    {
        return "yx";
    }

}


