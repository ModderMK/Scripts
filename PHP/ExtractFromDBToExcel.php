<?php 
    include './conexao.php';

    header("Content-Type: application/vnd.ms-excel; charset=utf-8");
    header("Content-Disposition: attachment; filename=extract.xlsx");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Cache-Control: private",false);
    
    $query = "";
    $result = oci_parse($conn_ora, $query);
    oci_execute($result);

    $columns = [];
    $columnCount = oci_num_fields($result);

    for ($i = 1; $i <= $columnCount; $i++) {
        $columnName = oci_field_name($result, $i);
        $columns[] = $columnName;
    }
?> 

<table cellspacing="0" cellpadding="0">
    <thead>
        <?php
            foreach ($columns as $column) {
                echo '<th style="text-align: center;">' . $column . '</th>';
            }
        ?>
    </thead>

    <tbody>
        <?php
            while($row = oci_fetch_array($result)){
                echo '<tr>';
                    foreach ($columns as $column) {
                        echo '<td style="text-align: center;">' . $row[$column] . '</td>';
                    }
                echo '</tr>';
            }
        ?>    
    </tbody>              
</table>