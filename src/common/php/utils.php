<?php

function cx($classes) {

    $className = '';

    foreach ($classes as $key => $value) {

        if (is_array($value)) {
            $nestedClassName = cx($value);
            if (!empty($nestedClassName)) {
                $className .= " $nestedClassName";
            }
        }

        if (!empty($value)) {
            $className .= ' ' . is_numeric($key) ? $value : $key;
        }

    }

    return $className;

}
