import Widget from "../widget/Widget";

export default class Cache 
{
    static logout( props ) 
    {
        sessionStorage.removeItem("_user_access_");
        localStorage.removeItem("access_token");
        sessionStorage.removeItem("_user_info_");
        sessionStorage.removeItem("_user_login_info_");

        Widget.removeSessionStorage("_left_node_activeKey_");
        Widget.removeSessionStorage("_left_node_openKey_");

        if( props!==undefined && props!==null && props.history )
        {
            props.history.push("/login");
            window.location.reload();  //强制刷新
        }else{
            window.location.reload();
        }
    }
}