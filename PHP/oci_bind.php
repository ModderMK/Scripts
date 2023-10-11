<!-- 
    $bindings = [
        'bind_name' => $bind_value
    ];
    $sql = bindValuesToQuery($query, $bindings, $conn_ora); 
-->
<?php
    function bindValuesToQuery($query, $values, $connection) {
        preg_match_all('/:([a-zA-Z0-9_]+)/', $query, $matches);

        $placeholders = $matches[0];
        $statement = oci_parse($connection, $query);

        foreach ($placeholders as $placeholder) {
            $paramName = $placeholder;
            $paramName = str_replace(':', '', $paramName);
            
            if (array_key_exists($paramName, $values)) {
                if(is_null($values[$paramName])){
                    oci_bind_by_name($statement, $placeholder, $values[$paramName], -1, 0);
                }else{
                    oci_bind_by_name($statement, $placeholder, $values[$paramName], -1);
                }
            }
        }

        $boundSql = $query;
        foreach ($values as $paramName => $paramValue) {
            if (is_null($paramValue)) {
                $paramValue = 'NULL';
            }else{
                $paramValue = "'" . $paramValue . "'";
            }
            $boundSql = str_replace(":$paramName", $paramValue, $boundSql);
        }
        //echo "Bound SQL: $boundSql"; //DEBUG

        return $statement;
    }
?>