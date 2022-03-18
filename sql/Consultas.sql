-------Para calcula el valor de la venta, sumo los precios unitarios, sumo iva y resto descuentos.
SELECT
  F.sku as 'codigo Producto',
  SUM(F.cantidad) as 'total cantidades',
  SUM(F.precio_unitario - F.descuento + F.iva) as 'Valor Venta',
  SUM(F.costo_unitario) as 'Total Costo'
from
  facturacion_detalle F
GROUP by
  sku 
  
  
  

----Segunda Consulta. Los Fact algunos me quedaban ordenamos y otros no por un motivo que desconozco, 
----pues en la linea 10 le digo que me ordene en orden los fact.
----
select fecha_realizacion as 'Fecha Venta' , documento as 'Doc Cliente', nombre as 'Nombre Cliente' , Consecutivos as 'Consecutivos de Venta', TotalP as 'Total Venta' , TotalC as 'Total Cantidad', TotalI as 'Total IVA'from
(
SELECT
  F.fecha_realizacion,
  C.documento,
  C.nombre,
  concat('(' , GROUP_CONCAT(F.fact_prefijo, '-', F.fact_consecutivo), ')') as Consecutivos,
  F.id_factura
FROM
 (SELECT * from facturacion order by fact_consecutivo asc) as F
 #JOIN facturacion_detalle D
 JOIN tercero C ON C.id_tercero = F.id_tercero 
GROUP BY
F.fecha_realizacion
ORDER BY
  C.fecha_registro DESC,
    F.fecha_realizacion DESC
    ) as new 
    JOIN 
    (
    SELECT
  sum(D.precio_unitario) as TotalP,
  sum(D.cantidad) as TotalC,
  sum(D.iva) as TotalI,
    F.id_factura
 FROM
 facturacion F
 JOIN facturacion_detalle D
 ON D.id_factura = F.id_factura
GROUP BY
    F.id_factura
    ) as old on old.id_factura = new.id_factura