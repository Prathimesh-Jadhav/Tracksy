
import { Table } from '@radix-ui/themes'
import React from 'react'

const DashProductsTable = ({salesData}) => {
    return (
        <div className='w-full rounded-lg mt-4 overflow-x-auto'>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Cust. Id</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className='max-md:hidden'>Mobile No</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className='max-md:hidden'>No.of Items</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Total Amount</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        salesData.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={5} className='text-center text-gray-500'>No sales data available</Table.Cell>
                            </Table.Row>
                        ) : salesData.map((sale, index) => (
                            <Table.Row key={index}>
                                <Table.RowHeaderCell>{sale.saleID}</Table.RowHeaderCell>
                                <Table.Cell className='max-w-[50px]'>{sale.customerName}</Table.Cell>
                                <Table.Cell className='max-md:hidden'>{sale.mobileNumber}</Table.Cell>
                                <Table.Cell className='max-md:hidden'>{sale.soldProducts.reduce((total, product) => total + product.quantity, 0)}</Table.Cell>
                                <Table.Cell>{sale.totalAmount}</Table.Cell>
                            </Table.Row>
                        ))
                    }

                </Table.Body>
            </Table.Root>
        </div>
    )
}

export default DashProductsTable
